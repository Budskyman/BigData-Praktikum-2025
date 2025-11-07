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
