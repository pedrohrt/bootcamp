import { parseISO, format, addMonths } from 'date-fns';
import pt from 'date-fns/locale/pt';

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
    const dateFormated = format(end_date, "dd 'de' MMMM 'de' yyyy", {
      locale: pt,
    });

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
      template: 'inscricao',
      context: {
        student: student.name,
        plan: plan.title,
        duration: dateFormated,
        prices: price,
      },
    });

    return res.json(enrollment);
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      attributes: ['id', 'start_date', 'price'],
      include: [
        {
          model: Student,
          as: 'students',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plans',
          attributes: ['title'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async update(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(401).json({ error: 'Enrollment does not existis' });
    }
    const { plan_id, start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);

    const end_date = addMonths(parseISO(start_date), plan.duration);

    const price = plan.price * plan.duration;

    const { id, student_id } = await enrollment.update({
      plan_id,
      start_date,
      end_date,
    });

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(401).json({ error: 'Enrolment does not existis' });
    }

    enrollment.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res
      .status(201)
      .json({ error: false, message: 'Enrollment deleted' });
  }
}

export default new EnrollmentController();
