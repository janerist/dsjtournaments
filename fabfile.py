from fabric.api import run, env, local, put, sudo, settings, lcd
import os

env.hosts = ['janerist@dsjtournaments.com']

def deploy():
    deploy_api()
    deploy_upload()
    deploy_web()

    deploy_id()

    deploy_admin_api()
    deploy_admin()


def deploy_id():
    deploy_dotnetcoreapp('id/DSJTournaments.Id/DSJTournaments.Id.csproj',
                         '/opt/dsjtournaments/id',
                         'dsjtournaments-id')


def deploy_api():
    deploy_dotnetcoreapp('api/DSJTournaments.Api/DSJTournaments.Api.csproj',
                         '/opt/dsjtournaments/api',
                         'dsjtournaments-api')


def deploy_upload():
    deploy_dotnetcoreapp('upload/DSJTournaments.Upload/DSJTournaments.Upload.csproj',
                         '/opt/dsjtournaments/upload',
                         'dsjtournaments-upload')


def deploy_admin_api():
    deploy_dotnetcoreapp('admin-api/DSJTournaments.AdminApi/DSJTournaments.AdminApi.csproj',
                         '/opt/dsjtournaments/admin-api',
                         'dsjtournaments-admin-api')
                         

def deploy_web():
    deploy_ng_app('web', '/opt/dsjtournaments/web')


def deploy_admin():
    deploy_ng_app('admin-web', '/opt/dsjtournaments/admin')


def deploy_dotnetcoreapp(csproj_path, remote_path, service_name, 
                         framework='netcoreapp2.1',
                         runtime='ubuntu.16.04-x64',
                         configuration='Release'):
    project_path = os.path.dirname(csproj_path)
    output_path = '{0}/bin/{1}/{2}/{3}/publish'.format(project_path, configuration, framework, runtime)
    executable_name = os.path.splitext(os.path.basename(csproj_path))[0]
    archive_name = '{0}.tar.gz'.format(executable_name)    

    with lcd(project_path):
        local('dotnet restore -r {0}'.format(runtime))

    local('dotnet publish {0} -f {1} -c {2} -r {3}'.format(csproj_path, framework, configuration, runtime))
    local('tar czf {0} --directory {1} .'.format(archive_name, output_path))
    put(archive_name)

    with settings(warn_only=True):
        run('mkdir -p {0}'.format(remote_path))
        run('rm -r {0}/*'.format(remote_path))

    run('tar xzf {0} -C {1}'.format(archive_name, remote_path))
    run('chmod +x {0}/{1}'.format(remote_path, executable_name))
    sudo('systemctl restart {0}'.format(service_name), shell=False)

    # Clean up
    run('rm {0}'.format(archive_name))
    local('rm {0}'.format(archive_name))


def deploy_ng_app(project_path, remote_path):
    output_path = '{0}/dist'.format(project_path)
    archive_name = '{0}.tar.gz'.format(os.path.basename(project_path))
    
    with lcd(project_path):
        local('ng build --prod')

    local('tar czf {0} --directory {1} .'.format(archive_name, output_path))
    put(archive_name)

    with settings(warn_only=True):
        run('mkdir -p {0}'.format(remote_path))
        run('rm -r {0}/*'.format(remote_path))

    run('tar xzf {0} -C {1}'.format(archive_name, remote_path))

    # Clean up
    run('rm {0}'.format(archive_name))
    local('rm {0}'.format(archive_name))