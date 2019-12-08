import { parseISO, forma, addMonths } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Mail from '../../lib/Mail';

class EnrollmentController {
  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;

    const enrollmentExistis = await Enrollment.findOne({
      where: {
        student_id,
      },
    });

    if (enrollmentExistis) {
      return res.status(400).json({ error: 'Student is registered in plan' });
    }

    const plan = await Plan.findByPk(plan_id);
    const student = await Student.findByPk(student_id);

    const end_date = addMonths(parseISO(start_date), plan.duration);

    const price = plan.price * plan.duration;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Agendamento feito com sucesso',
      text: `
      Seja bem-vindo à Gympoint. Veja os detalhes do seu plano:
      Plano: ${plan.title}
      Data do Término: ${end_date}
      Preco Total: ${price}
      `,
    });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
