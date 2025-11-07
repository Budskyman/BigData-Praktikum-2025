# Pull dan run Hadoop container
docker pull harisekhon/hadoop:2.8
docker run -it -p 50070:50070 harisekhon/hadoop:2.8 /bin/bash

# Di dalam container - HDFS setup
$HADOOP_HOME/sbin/start-dfs.sh
hdfs namenode -format
jps

# HDFS operations (simulasi)
hdfs dfs -mkdir /praktikum
echo "id,nama,jurusan" > sample.csv
echo "1,Andi,Informatika" >> sample.csv
hdfs dfs -put sample.csv /praktikum/
hdfs dfs -ls /praktikum
hdfs dfs -cat /praktikum/sample.csv

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Masuk MongoDB shell
docker exec -it mongodb mongosh

# Cek status containers
docker ps
docker ps -a

// Switch database
use praktikum

// Insert single document dengan nested JSON
db.mahasiswa.insertOne({
  nim: "12345",
  nama: "Andi",
  jurusan: "Informatika",
  alamat: {
    jalan: "Jl. Merdeka No. 1",
    kota: "Jakarta",
    kode_pos: "12345"
  },
  kontak: {
    email: "andi@email.com",
    telepon: "08123456789"
  }
})

// Insert multiple documents
db.mahasiswa.insertMany([
  {
    nim: "12346",
    nama: "Budi", 
    jurusan: "Sistem Informasi",
    alamat: {
      jalan: "Jl. Sudirman No. 2",
      kota: "Bandung"
    }
  },
  {
    nim: "12347",
    nama: "Citra",
    jurusan: "Teknik Komputer", 
    alamat: {
      jalan: "Jl. Thamrin No. 3",
      kota: "Surabaya"
    }
  }
])

// Read operations
db.mahasiswa.find()
db.mahasiswa.find().pretty()
db.mahasiswa.find({ jurusan: "Informatika" }).pretty()

// Update operations
db.mahasiswa.updateOne(
  { nim: "12345" },
  { $set: { ipk: 3.75 } }
)

// Delete operations  
db.mahasiswa.deleteOne({ nim: "12347" })

// Indexing
db.mahasiswa.createIndex({ nim: 1 })

// Sorting
db.mahasiswa.find().sort({ nama: 1 }).pretty()

// Aggregation
db.mahasiswa.aggregate([
  { $group: { 
      _id: "$jurusan", 
      total: { $count: { } },
      rata_ipk: { $avg: "$ipk" }
  }}
])

# Install dan setup
!pip install pyspark

from pyspark.sql import SparkSession
from pyspark.sql.functions import *

# Spark Session
spark = SparkSession.builder \
    .appName("PraktikumBigData") \
    .getOrCreate()

# Word Count - RDD
data = ["Hello Spark", "Hello World", "Spark is awesome"]
rdd = spark.sparkContext.parallelize(data)
word_counts_rdd = rdd.flatMap(lambda line: line.split(" ")) \
                     .map(lambda word: (word, 1)) \
                     .reduceByKey(lambda a, b: a + b)
print(word_counts_rdd.collect())

# Word Count - DataFrame
df = spark.createDataFrame([(text,) for text in data], ["text"])
word_counts_df = df.select(explode(split(col("text"), " ")).alias("word")) \
                  .groupBy("word") \
                  .count() \
                  .orderBy(col("count").desc())
word_counts_df.show()

spark.stop()

from pyspark.sql.types import *

# Sample data
data_kotor = [
    (1, 'Budi Susanto', 25, 5500000, 'L', '2022-01-15', 'Jakarta', 'Transaksi berhasil'),
    (2, 'Ani Lestari', None, 8000000, 'P', '2022-02-20', 'Bandung', 'Pengiriman cepat'),
    (3, 'Candra Wijaya', 35, 12000000, 'L', '2022-01-18', 'Surabaya', 'Sangat puas'),
    (4, 'Dewi Anggraini', 22, 4800000, 'P', '2022-03-10', 'JKT', 'Barang diterima'),
    (5, 'Budi Susanto', 25, 5500000, 'L', '2022-01-15', 'Jakarta', 'Transaksi berhasil')
]

# Schema
schema = StructType([
    StructField("id", IntegerType(), True),
    StructField("nama", StringType(), True),
    StructField("usia", IntegerType(), True),
    StructField("gaji", IntegerType(), True),
    StructField("jk", StringType(), True),
    StructField("tgl", StringType(), True),
    StructField("kota", StringType(), True),
    StructField("ulasan", StringType(), True)
])

df = spark.createDataFrame(data_kotor, schema=schema)

# Data Cleaning
from pyspark.sql.functions import when, isnan, count, mean

# Handle missing values
df_clean = df.na.fill({"usia": 30, "ulasan": "Tidak ada ulasan"})

# Remove duplicates
df_clean = df_clean.dropDuplicates()

# Standardize values
df_clean = df_clean.withColumn("kota", 
    when(df_clean["kota"] == "JKT", "Jakarta")
    .otherwise(df_clean["kota"]))

# Fix noisy data
df_clean = df_clean.withColumn("gaji", abs(df_clean["gaji"]))
df_clean = df_clean.filter(df_clean["usia"] <= 100)

print("Data setelah cleaning:")
df_clean.show()

# Simulasi Sqoop Import/Export
import pandas as pd

# Data dari MySQL
mysql_data = [
    (1, 'Andi', 'Engineering', 7500000),
    (2, 'Budi', 'Marketing', 6500000),
    (3, 'Citra', 'Engineering', 8000000)
]

df_mysql = pd.DataFrame(mysql_data, columns=['id', 'nama', 'department', 'gaji'])
print("Data dari MySQL:")
print(df_mysql)

# Simulasi import ke HDFS
print("Sqoop import ke HDFS: /user/hadoop/employees/")

# Simulasi export dari HDFS
new_data = pd.DataFrame([(4, 'Dewi', 'HR', 7000000)], columns=['id', 'nama', 'department', 'gaji'])
print("Sqoop export ke MySQL tabel 'employees_export'")

# Simulasi Flume Log Collection
import time

logs = [
    "2024-01-15 INFO: User login successful",
    "2024-01-15 ERROR: Database connection failed", 
    "2024-01-15 INFO: Data processing completed"
]

print("Flume Agent menerima log:")
for log in logs:
    print(f"📨 {log}")
    time.sleep(1)

# Simulasi Kafka Producer/Consumer
messages = [
    "Pesan pertama: Hello Kafka!",
    "Data sensor: temperature=25.6C", 
    "User action: button_clicked"
]

print("Producer mengirim pesan:")
for msg in messages:
    print(f"📤 PRODUCER: {msg}")

print("\nConsumer menerima pesan:")
for msg in messages:
    print(f"📥 CONSUMER: {msg}")
    time.sleep(1)

# docker-compose.yml
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "9092:9092"

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: company
    ports:
      - "3306:3306"

# Lihat running containers
docker ps

# Lihat semua containers (termasuk stopped)
docker ps -a

# Stop container
docker stop [container_id]

# Start container
docker start [container_id]

# Masuk ke container
docker exec -it [container_id] /bin/bash

# Hapus container
docker rm [container_id]

# Hapus image
docker rmi [image_id]
