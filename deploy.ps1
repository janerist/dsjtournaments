$sshHost = "janerist@dsjtournaments.com"

function DeployDotNetCoreApp(
    [string] $csprojPath,
    [string] $remotePath,
    [string] $serviceName,
    [string] $framework = "netcoreapp2.1",
    [string] $runtime = "ubuntu.16.04-x64",
    [string] $configuration = "Release") 
{
    $projectPath = Split-Path $csprojPath
    $outputPath = "$projectPath\bin\$configuration\$framework\$runtime\publish"
    $csprojFileName = Split-Path $csprojPath -Leaf
    $executableName = [io.path]::GetFileNameWithoutExtension($csprojFileName)
    $archiveName = "$executableName.tar.gz"
        
    dotnet publish $csprojPath -f $framework -c $configuration -r $runtime
    tar czf $archiveName --directory $outputPath .
    scp $archiveName $sshHost`:~/
    ssh $sshHost "mkdir -p $remotePath"
    ssh $sshHost "rm -r $remotePath/*"
    ssh $sshHost "tar xzf $archiveName -C $remotePath"
    ssh $sshHost "chmod +x $remotePath/$executableName"
    ssh $sshHost "sudo systemctl restart $serviceName"
    
    # Clean up
    ssh $sshHost "rm $archiveName"
    Remove-Item $archiveName
}

function DeployAngularApp([string] $projectPath, [string] $remotePath)
{
    $outputPath = "$projectPath/dist"
    $folderName = Split-Path $projectPath -Leaf
    $archiveName = "$folderName.tar.gz"

    cd $projectPath
    npm run build
    cd ..

    tar czf $archiveName --directory $outputPath .
    scp $archiveName $sshHost`:~/
    ssh $sshHost "mkdir -p $remotePath"
    ssh $sshHost "rm -r $remotePath/*"
    ssh $sshHost "tar xzf $archiveName -C $remotePath"

    # Clean up
    ssh $sshHost "rm $archiveName"
    Remove-Item $archiveName
}

function DeployApi()
{
    $csProjPath = ".\api/DSJTournaments.Api/DSJTournaments.Api.csproj"
    $remotePath = "/opt/dsjtournaments/api"
    $serviceName = "dsjtournaments-api"
    
    DeployDotNetCoreApp $csProjPath $remotePath $serviceName        
}

function DeployUpload()
{
    $csProjPath = ".\upload/DSJTournaments.Upload/DSJTournaments.Upload.csproj"
    $remotePath = "/opt/dsjtournaments/upload"
    $serviceName = "dsjtournaments-upload"
    
    DeployDotNetCoreApp $csProjPath $remotePath $serviceName        
}

function DeployWeb()
{
    $projectPath = ".\web"
    $remotePath = "/opt/dsjtournaments/web"

    DeployAngularApp $projectPath $remotePath
}

function DeployId()
{
    $csProjPath = ".\id/DSJTournaments.Id/DSJTournaments.Id.csproj"
    $remotePath = "/opt/dsjtournaments/id"
    $serviceName = "dsjtournaments-id"
    
    DeployDotNetCoreApp $csProjPath $remotePath $serviceName        
}

function DeployAdminApi()
{
    $csProjPath = ".\admin-api/DSJTournaments.AdminApi/DSJTournaments.AdminApi.csproj"
    $remotePath = "/opt/dsjtournaments/admin-api"
    $serviceName = "dsjtournaments-admin-api"
    
    DeployDotNetCoreApp $csProjPath $remotePath $serviceName        
}

function DeployAdmin()
{
    $projectPath = ".\admin-web"
    $remotePath = "/opt/dsjtournaments/admin"

    DeployAngularApp $projectPath $remotePath
}

DeployApi
DeployUpload
DeployWeb
DeployId
DeployAdminApi
DeployAdmin