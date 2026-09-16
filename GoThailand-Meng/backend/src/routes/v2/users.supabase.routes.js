import { Router } from "express";
import bcrypt from "bcrypt";
import { supabase } from "../../config/supabase.js";

export const router = Router();

const PG_SELECT = "id, username, email, role, created_at, updated_at";

// Read users
router.get("/pg", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("users").select(PG_SELECT);
    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/// Create user
router.post("/pg", async (req, res, next) => {
  try {
    const { username, role, email, password } = req.body;

    if (!username || !role || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, role, email and password are required." });
    }

    // 1. เข้ารหัส password ด้วย bcrypt ก่อนเซฟลง PostgreSQL
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Insert ข้อมูลลงในตาราง 'users' ของ Supabase
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          role,
          email,
          password: hashedPassword,
        },
      ])
      .select("id, username, role, email, created_at") // เลือกเอาเฉพาะฟิลด์ที่ไม่เอา password กลับมา
      .single();

    if (error) {
      // ป้องกันกรณี Email ซ้ำ หรือ Database Error
      return res.status(400).json({ error: error.message });
    }

    // 3. ส่งข้อมูลผู้ใช้กลับ (ไม่มี password ติดไปแน่นอน)
    return res.status(201).json(newUser);

  } catch (err) {
    next(err);
  }
});

// Update user
router.put("/pg/:id", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const { id } = req.params;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "username, email and password are required!" });
    }

    // 1. เข้ารหัส password ใหม่ด้วย bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. สั่ง อัปเดตข้อมูลในตาราง 'users' เงื่อนไข id ตรงกับ req.params.id
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        username,
        email,
        password: hashedPassword,
      })
      .eq("id", id)
      .select("id, username, email, role, created_at") // เลือกเฉพาะฟิลด์ที่ต้องการส่งกลับ (ไม่ส่ง password)
      .maybeSingle(); // คืนค่า Object เดียว หรือ null หากหาไม่เจอ

    // 3. จัดการกรณี Database Error
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 4. กรณีหา id ไม่เจอในตาราง
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// Delete user
router.delete("/pg/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. สั่งลบข้อมูลในตาราง 'users' โดยอ้างอิงจาก id
    const { data: deletedUser, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select("id, username, email") // คืนค่าข้อมูลที่เพิ่งลบกลับมาดู (ถ้าไม่ใส่ select จะได้ data เป็น null)
      .maybeSingle(); // ป้องกัน Error กรณีหา id ไม่เจอ

    // 2. จัดการกรณีเกิด Error จากการ Query ใน Database
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    // 3. กรณีไม่พบ id ที่ต้องการลบใน Database
    if (!deletedUser) {
      return res.status(404).json({ success: false, error: "User not found!" });
    }

    // 4. ส่ง Response ตอบกลับเมื่อลบสำเร็จ
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    next(err);
  }
});
