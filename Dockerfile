# Dockerfile extending the generic Node image with application files for a
# single application.
FROM gcr.io/google_appengine/nodejs


RUN echo "deb http://ftp.uk.debian.org/debian jessie-backports main" >> /etc/apt/sources.list && \
    apt-get update -y && apt-get install -y -q locate libvpx-dev && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
  build-essential \
  software-properties-common \
  ca-certificates \
  byobu curl git htop man unzip vim wget \
  sudo \
  gconf-service \
  libcurl3 \
  libexif-dev \
  libgconf-2-4 \
  libglib2.0-0 \
  libgl1-mesa-dri \
  libgl1-mesa-glx \
  libnspr4 \
  libnss3 \
  libpango1.0-0 \
  libv4l-0 \
  libxss1 \
  libxtst6 \
  libxrender1 \
  libx11-6 \
  libxft2 \
  libfreetype6 \
  libc6 \
  zlib1g \
  libpng12-0 \
  wget \
  apt-utils \
  xdg-utils \
  --no-install-recommends && \
  curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash - && \
  sudo apt-get install -y nodejs libnss3 && \
  rm -rf /var/lib/apt/lists/*

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - && \
    sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update -y && apt-get install -y google-chrome-stable && rm -rf /var/lib/apt/lists/*

ENV CHROME_PATH /usr/bin/google-chrome

COPY . /app/
WORKDIR /app/

RUN npm install --unsafe-perm --global yarn && npm install --unsafe-perm --global nodemon && \
  npm install --production && npm install puppeteer || \
  ((if [ -f npm-error.log ]; then \
      cat npm-error.log; \
    fi) && false)

CMD npm start
