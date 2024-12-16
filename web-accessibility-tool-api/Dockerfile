# Node.js imajını kullan
FROM node:16

# Çalışma dizini oluştur
WORKDIR /app

# package.json ve yarn.lock dosyalarını önce kopyalayın
COPY package.json ./

# npm cache'ini oluştur ve bağımlılıkları yükle
RUN npm install 

# Uygulamanın geri kalan kısmını kopyala
COPY . .

# Uygulama başlatma komutu
CMD ["node", "index.js"]