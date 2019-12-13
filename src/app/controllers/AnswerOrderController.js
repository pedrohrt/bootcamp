import Student from '../models/Student';

import HelpOrder from '../models/HelpOrder';
import Mail from '../../lib/Mail';

class ListOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      attributes: ['id', 'question', 'student_id'],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const { id } = req.params;

    const { answer } = req.body;

    const answerOrder = await HelpOrder.findOne({
      where: { id },
      include: [
        {
          model: Student,
          as: 'students',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!answerOrder) {
      return res.status(401).json({ error: 'Help order does not existis' });
    }

    answerOrder.answer = answer;
    answerOrder.answer_at = new Date();

    await answerOrder.save();
    await Mail.sendMail({
      to: `${answerOrder.students.name} <${answerOrder.students.email}>`,
      subject: 'Pedido de Auxilio',
      template: 'answer',
      context: {
        student: answerOrder.students.name,
        question: answerOrder.question,
        answer,
      },
    });

    const { id: answer_id, question, answer: new_answer } = answerOrder;

    return res.json({ id: answer_id, question, answer: new_answer });
  }
}

export default new ListOrderController();
