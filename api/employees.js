const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

//step 2
router.get("/", async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (e) {
    next(e);
  }
});

//step 3
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (employee) {
      res.json(employee);
    } else {
      next({ status: 404, message: `employee with id ${id} does not exist` });
    }
  } catch (e) {
    next(e);
  }
});

//step 4
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  //error handler from 5
  if (!name) {
    return next({
      status: 400,
      message: "new name must be provided",
    });
  }
  //new syntax
  try {
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (!employee) {
      return next({
        status: 404,
        message: `employee with id ${id} does not exist`,
      });
    }

    const updateemployee = await prisma.employee.update({
      where: { id: +id },
      data: { name },
    });
    res.json(updateemployee);
  } catch (error) {
    next(error);
  }
});

//step 5
router.post("/", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next({
      status: 400,
      message: "employee must have name",
    });
  }
  try {
    const newemployee = await prisma.employee.create({ data: { name } });
    res.status(201).json(newemployee);
  } catch (e) {
    next(e);
  }
});

//step 6
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (!employee) {
      return next({
        status: 404,
        message: `employee with id ${id} does not exist`,
      });
    }

    await prisma.employee.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});
