$sshHost = "janerist@dsjtournaments.com"

function DeployDotNetCoreApp(
    [string] $csprojPath,
    [string] $remotePath,
    [string] $serviceName,
    [string] $framework = "net9.0",
    [string] $runtime = "linux-x64",
    [string] $configuration = "Release") 
{
    $projectPath = Split-Path $csprojPath
    $outputPath = "$projectPath\bin\$configuration\$framework\$runtime\publish"
    $csprojFileName = Split-Path $csprojPath -Leaf
    $executableName = [io.path]::GetFileNameWithoutExtension($csprojFileName)
    $archiveName = "$executableName.tar.gz"
        
    dotnet publish $csprojPath -f $framework -c $configuration -r $runtime --self-contained
    tar czf $archiveName --directory $outputPath .
    scp $archiveName $sshHost`:~/
    ssh $sshHost "sudo mkdir -p $remotePath"
    ssh $sshHost "sudo rm -r $remotePath/*"
    ssh $sshHost "sudo tar xzf $archiveName -C $remotePath"
    ssh $sshHost "sudo chmod +x $remotePath/$executableName"
	ssh $sshHost "sudo chown -R dsjtournaments:dsjtournaments $remotePath"
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
    npm run build -- --configuration production
    cd ..

    tar czf $archiveName --directory $outputPath .
    scp $archiveName $sshHost`:~/
    ssh $sshHost "sudo mkdir -p $remotePath"
    ssh $sshHost "sudo rm -r $remotePath/*"
    ssh $sshHost "sudo tar xzf $archiveName -C $remotePath"
	ssh $sshHost "sudo chown -R dsjtournaments:dsjtournaments $remotePath"

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

function DeployAdmin()
{
    $projectPath = ".\admin-web"
    $remotePath = "/opt/dsjtournaments/admin"

    DeployAngularApp $projectPath $remotePath
}

DeployApi
#DeployWeb
DeployId
#DeployAdmin
