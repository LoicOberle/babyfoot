ALTER USER 'babyfoot'@'%' IDENTIFIED WITH mysql_native_password BY 'babyfoot';
GRANT ALL PRIVILEGES ON *.* TO 'babyfoot'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
