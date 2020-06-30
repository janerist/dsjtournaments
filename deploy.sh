#!/bin/bash

SSH_HOST="janerist@dsjtournaments.com"

deployDotNetCoreApp() {
    projectPath=$1
    remotePath=$2
    serviceName=$3
    framework="netcoreapp3.1"
    runtime="linux-x64"    
    outputPath=$projectPath/publish
    executableName=$(basename $projectPath)
    archiveName=$executableName.tar.gz

    rm -rf $projectPath/{bin,obj,publish}
    dotnet publish $projectPath -c Release -f $framework -r $runtime -o $outputPath
    tar czf $archiveName --directory $outputPath .
    scp $archiveName $SSH_HOST:~/
    ssh $SSH_HOST << EOF
        sudo mkdir -p $remotePath
        sudo rm -r $remotePath/*
        sudo tar xzf $archiveName -C $remotePath
        sudo chmod +x $remotePath/$executableName
        sudo chown -R dsjtournaments:dsjtournaments $remotePath
        sudo systemctl restart $serviceName
        rm $archiveName
EOF
    rm $archiveName
}

deployAngularApp() {
    projectPath=$1
    remotePath=$2
    archiveName=$(basename $projectPath).tar.gz

    /usr/bin/npm run build --prefix $projectPath
    tar czf $archiveName --directory $projectPath/dist .
    scp $archiveName $SSH_HOST:~/
    ssh $SSH_HOST << EOF
        sudo mkdir -p $remotePath
        sudo rm -r $remotePath/*
        sudo tar xzf $archiveName -C $remotePath
        sudo chown -R dsjtournaments:dsjtournaments $remotePath
        rm $archiveName
EOF
    rm $archiveName
}

deployApi() {
    projectPath="api/DSJTournaments.Api"
    remotePath="/opt/dsjtournaments/api"
    serviceName="dsjtournaments-api"

    deployDotNetCoreApp $projectPath $remotePath $serviceName
}

deployWeb() {
    projectPath="web"
    remotePath="/opt/dsjtournaments/web"

    deployAngularApp $projectPath $remotePath
}

deployId() {
    projectPath="id/DSJTournaments.Id"
    remotePath="/opt/dsjtournaments/id"
    serviceName="dsjtournaments-id"

    deployDotNetCoreApp $projectPath $remotePath $serviceName
}

deployAdmin() {
    projectPath="admin-web"
    remotePath="/opt/dsjtournaments/admin"

    deployAngularApp $projectPath $remotePath
}

deployApi
deployWeb
deployId
deployAdmin