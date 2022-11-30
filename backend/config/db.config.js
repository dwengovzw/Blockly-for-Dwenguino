import mongoose from 'mongoose';
import { User, Student, Teacher } from "../models/users.model.js"
import Role from "../models/role.model.js"

const db = {}
db.mongoose = mongoose;
db.user = User;
db.role = Role;
db.ROLES = ["student", "teacher", "admin", "subscriber"]

export default db