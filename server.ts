import fs from "fs";
import path from "path";
import cors from "cors";
import express, { Request, Response } from "express";

const PORT = 3000;
const app = express();

const holidayPlansFilePath = path.join(__dirname, "data", "holidayPlans.json");

app.use(cors());
app.use(express.json());

app.get("/api/holiday-plans", (req: Request, res: Response) => {
  fs.readFile(holidayPlansFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send("There was an error when reading the vacation plans.");
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/holiday-plans', (req: Request, res: Response) => {
  const newPlan = req.body; 

  fs.readFile(holidayPlansFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao ler os planos de férias.');
      return;
    }

    const holidayPlans = JSON.parse(data);

    holidayPlans.push(newPlan);

    fs.writeFile(holidayPlansFilePath, JSON.stringify(holidayPlans), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao salvar o novo plano de férias.');
        return;
      }

      res.status(201).json(newPlan);
    });
  });
});

app.delete("/api/holiday-plans/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  // Ler o arquivo JSON
  fs.readFile(holidayPlansFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler arquivo JSON:", err);
      return res.status(500).send("Erro ao ler plano de férias.");
    }

    let holidayPlans = JSON.parse(data);

    const index = holidayPlans.findIndex((plan: any) => plan.id === id);
    if (index === -1) {
      return res.status(404).send("Plano de férias não encontrado.");
    }

    holidayPlans.splice(index, 1);

    fs.writeFile(holidayPlansFilePath, JSON.stringify(holidayPlans), (err) => {
      if (err) {
        console.error("Erro ao escrever no arquivo JSON:", err);
        return res.status(500).send("Erro ao excluir plano de férias.");
      }
      res.status(200).json({message : "Plano excluído com sucesso!"});
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
