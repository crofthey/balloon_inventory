CREATE DATABASE IF NOT EXISTS `balloon_inventory`;

SET @user_exists := (SELECT COUNT(*) FROM mysql.user WHERE user = 'root' AND host = '%');

IF @user_exists = 0 THEN
    CREATE USER 'root'@'%' IDENTIFIED BY '${DB_PASSWORD}';
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
END IF;
FLUSH PRIVILEGES;
