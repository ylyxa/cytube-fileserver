server {
	# SSL configuration
	listen 443 ssl;
	listen [::]:443 ssl;

	ssl_certificate     replace-with-cert.pem;
	ssl_certificate_key replace-with-key.pem;
	ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
	ssl_ciphers         HIGH:!aNULL:!MD5;

	# Replace with your host url
	server_name stream.forresthopkinsa.com;

	location / {
		proxy_pass  http://localhost:3001;
		proxy_set_header X-Forwarded-Host  $host;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_set_header X-Forwarded-Port  $server_port;
	}

	location /media/ {
		root        /var/www/stream;
		autoindex   on;

		# wide-open CORS
		if ($request_method = 'OPTIONS') {

			add_header 'Access-Control-Allow-Origin' '*';


			add_header 'Access-Control-Allow-Credentials' 'true';
			add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';


			add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';


			add_header 'Access-Control-Max-Age' 1728000;
			add_header 'Content-Type' 'text/plain charset=UTF-8';
			add_header 'Content-Length' 0;

			return 204;
		}

		if ($request_method = 'POST') {

			add_header 'Access-Control-Allow-Origin' '*';
			add_header 'Access-Control-Allow-Credentials' 'true';
			add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
			add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';

		}

		if ($request_method = 'GET') {

			add_header 'Access-Control-Allow-Origin' '*';
			add_header 'Access-Control-Allow-Credentials' 'true';
			add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
			add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';

		}
	}


}
