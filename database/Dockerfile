FROM mariadb:10.6

COPY /data /var/lib/mysql

COPY /db_schema /docker-entrypoint-initdb.d

EXPOSE 3306