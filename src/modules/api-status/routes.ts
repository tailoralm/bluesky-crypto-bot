import express from 'express';
import GetPricesController from './get-prices.controller';


const app = express();

// app.all('*', applyCors);

app.get('/currentPrice/:id', (req, res) => {
    const controller = new GetPricesController(req.params.id);
    const result = controller.getCurrentPrice();
    return res.json(result);
});


export default app;
