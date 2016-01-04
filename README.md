# IT SAYS - SERVER RESTFUL FOR SAY IT! ANDROID APP

## Installation procedure

Install dependencies (git, nodejs, npm) with **Debian**:
```
apt-get install curl
curl -sL https://deb.nodesource.com/setup_5.x | bash -
apt-get install --yes nodejs
sudo apt-get install git-core
```

In any folder :
```
git clone git@github.com:From-Far-Away/ItSays.git
cd ItSays
npm install
echo "DB_HOST=<your_host>\r\nDB_USER=<your_user_credentials>\r\nDB_PASSWORD=<password>\r\nTOKEN_DURATION=<token duration in milliseconds>" >> .env
```

And to run it :
```
node server.js
```
