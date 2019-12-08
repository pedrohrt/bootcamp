import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const planExistis = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExistis) {
      return res.status(401).json({ error: 'Plan already exists' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const { index } = req.params;
    const plan = await Plan.findByPk(index);
    const { title, duration, price } = await plan.update(req.body);
    return res.json({
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plans = await Plan.findByPk(req.params.index);

    plans.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.status(201).json({ error: false, message: 'Plan deleted' });
  }
}

export default new PlanController();
