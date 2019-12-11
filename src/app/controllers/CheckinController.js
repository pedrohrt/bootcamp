import { Op } from 'sequelize';
import { subDays } from 'date-fns';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const subDay = subDays(new Date(), 7);

    const checkins = await Checkin.findAndCountAll({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [subDay, new Date()],
        },
      },
    });

    if (checkins.count >= 5) {
      return res
        .status(401)
        .json({ error: `Checkins demais pow: 5 no maximo` });
    }

    const createCheckin = await Checkin.create({
      student_id: id,
    });

    return res.json(createCheckin);
  }

  async index(req, res) {
    const { id } = req.params;
    const checkins = await Checkin.findAndCountAll({
      where: {
        student_id: id,
      },
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
