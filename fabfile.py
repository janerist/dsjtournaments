from fabric.api import run, env, local, put, sudo, settings, lcd

env.hosts = ['janerist@dsjtournaments.com']

def deploy():
    deploy_api()
    deploy_web()
    deploy_admin()


def deploy_api():
    framework = 'netcoreapp2.0'
    runtime = 'ubuntu.16.10-x64'
    configuration = 'Release'

    project_path = 'api/DSJTournaments.Api'
    csproj_path = '{0}/DSJTournaments.Api.csproj'.format(project_path)
    output_path = '{0}/bin/Release/{1}/{2}/publish'.format(project_path, framework, runtime)
    archive_name = 'dsjtournaments-api.tar.gz'
    remote_path = '/opt/dsjtournaments/api'

    local('dotnet publish {0} -f {1} -c {2} -r {3}'.format(csproj_path, framework, configuration, runtime))
    local('tar czf {0} --directory {1} .'.format(archive_name, output_path))
    put(archive_name)

    with settings(warn_only=True):
        run('mkdir -p {0}'.format(remote_path))
        run('rm -r {0}/*'.format(remote_path))

    run('tar xzf {0} -C {1}'.format(archive_name, remote_path))
    run('chmod +x {0}/DSJTournaments.Api'.format(remote_path))
    sudo('systemctl restart dsjtournaments-api', shell=False)

    # Clean up
    run('rm {0}'.format(archive_name))
    local('rm {0}'.format(archive_name))


def deploy_web():
    project_path = 'web'
    output_path = 'web/dist'
    archive_name = 'dsjtournaments-web.tar.gz'
    remote_path = '/opt/dsjtournaments/web'

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


def deploy_admin():
    project_path = 'admin'
    output_path = 'admin/dist'
    archive_name = 'dsjtournaments-admin.tar.gz'
    remote_path = '/opt/dsjtournaments/admin'

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
