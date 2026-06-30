import mongoose from "mongoose";

const uri =
"mongodb+srv://shreyamittal922_db_user:YOUR_PASSWORD@cluster0.dniwtsj.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
.then(() => {
    console.log("CONNECTED");
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});