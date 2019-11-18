const userExistis = await Students.findOne({
    where: { email: req.body.email },
  });

  if (userExistis) {
    return res.status(400).json({ error: 'Aluno ja existe' });
  }

  const { id, name, email, age, weight, height } = await Students.create(req.body);

  return res.json({
    id,
    name,
    email,
  });