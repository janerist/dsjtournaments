$backup_filename = "dsjt_backup_latest.custom"
$database_name = "dsjtournaments_dev"
$container_name = "dsjtournaments-db-1"

# Copy the latest backup file from the server
$today = (Get-Date).AddDays(-1).ToString("yyyyMMdd")
scp dsjtournaments.com:/var/lib/dsjtournaments/backups/dsjt_backup-$today* $backup_filename

# Make sure docker compose is running
podman compose up -d db

# Copy the backup file into the container
podman machine ssh "podman cp /mnt/d/dev/dsjtournaments/$backup_filename ${container_name}:/"

# Drop the dev database, if it exists
podman exec $container_name psql -U postgres -c "DROP DATABASE IF EXISTS $database_name WITH (FORCE)"

# Create the dev database anew
podman exec $container_name psql -U postgres -c "CREATE DATABASE $database_name"

# Restore the backup
podman exec $container_name pg_restore -U postgres -O -x -d $database_name /$backup_filename

# Delete the backup file
Remove-Item $backup_filename