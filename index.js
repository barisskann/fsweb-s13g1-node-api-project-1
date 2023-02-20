const server = require("./api/server");
const express = require("express");
const cors = require("cors");
const User = require("./api/users/model");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/users", (req, res) => {
  User.find()
    .then((r) => res.status(200).json(r))
    .catch((err) =>
      res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" })
    );
});
app.get("/api/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((r) => {
      if (!r) {
        return res
          .status(404)
          .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
      }
      res.status(200).json(r);
    })
    .catch((err) =>
      res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" })
    );
});

app.post("/api/users", (req, res) => {
  if (!req.body.data.name || !req.body.data.bio) {
    return res
      .status(400)
      .json({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
  }
  return User.insert(req.body.data)
    .then((r) => res.status(201).json(r))
    .catch((r) =>
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" })
    );
});
app.delete("/api/users/:id", (req, res) => {
  User.remove(req.params.id).then((r) => res.json(r));
});
app.put("/api/users/:id", (req, res) => {
  User.findById(req.params.id).then((r) => {
    if (!r) {
      return res
        .status(404)
        .json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    }
  });
  if (!req.body.data.name || !req.body.data.bio) {
    return res
      .status(400)
      .json({ message: "Lütfen kullanıcı için name ve bio sağlayın" });
  }
  User.update(req.params.id, req.body.data)
    .then((r) => {
      res.status(200).json(r);
    })
    .catch((err) =>
      res.send(500).json({ message: "Kullanıcı bilgileri güncellenemedi" })
    );
});
const PORT = 9000;
app.use("*", (req, res) => {
  res.status(404).json("NOT FOUND");
});
app.listen(PORT, () => {
  console.log("SERVER SUCCESS");
});
// START YOUR SERVER HERE
