import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { id } = req.params;
    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: id,
      },
      attributes: ['id', 'question', 'student_id'],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findOne({ where: { id } });

    if (!student) {
      return res.status(401).json({ error: 'Student does not existis' });
    }

    const newQuestion = await HelpOrder.create({
      student_id: id,
      question: req.body.question,
    });

    return res.json(newQuestion);
  }
}

export default new HelpOrderController();
