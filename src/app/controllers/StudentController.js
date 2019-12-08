import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const studentExistis = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExistis) {
      return res.status(401).json({ error: 'student already exists' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const { index } = req.params;
    const student = await Student.findByPk(index);
    const id = index;
    const { name, email, age, weight, height } = await student.update(req.body);
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
