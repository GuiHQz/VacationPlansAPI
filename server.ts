import cors from "cors";
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/holiday-plans", async (req: Request, res: Response) => {
  try {
    const holidayPlans = await prisma.holidayPlan.findMany();
    res.json(holidayPlans);
  } catch (err) {
    console.error("Erro ao ler os planos de férias.");
    res.status(500).send("Internal Error");
  }
});

app.get("/api/holiday-plans/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const plan = await prisma.holidayPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return res.status(404).send("Plano de férias não encontrado");
    }

    res.json(plan);
  } catch (err) {
    console.error("Erro ao buscar o plano de férias: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/holiday-plans", async (req: Request, res: Response) => {
  const { title, description, date, location, participants } = req.body;

  try {
    const newPlan = await prisma.holidayPlan.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        participants,
      },
    });
    res.status(201).json(newPlan);
  } catch (err) {
    console.error("Erro ao criar um novo plano de férias", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/api/holiday-plans/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const holidayPlan = await prisma.holidayPlan.findUnique({
      where: { id },
    });

    if (!holidayPlan) {
      return res.status(404).send("Plano de férias não encontrado.");
    }

    await prisma.holidayPlan.delete({
      where: { id },
    });

    console.log(`Plano de férias com ID ${id} excluído com sucesso.`); // Adicionando um log para registrar a exclusão bem-sucedida
    res.status(204).send();
  } catch (err) {
    console.error("Erro ao excluir o plano de férias: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/holiday-plans/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, date, location, participants } = req.body;

  try {
    const updatedPlan = await prisma.holidayPlan.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        location,
        participants,
      },
    });
    res.json(updatedPlan);
  } catch (err) {
    console.error("Erro ao atualizar o plano de férias: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
