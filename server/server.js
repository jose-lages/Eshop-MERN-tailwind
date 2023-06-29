const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config');

const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const blogRouter = require('./routes/blogRoutes');
const categoryRouter = require('./routes/prodCategoryRoutes');
const blogCategoryRouter = require('./routes/BlogCategoryRoutes');
const brandRouter = require('./routes/brandRoutes');
const couponRouter = require('./routes/couponRoutes');
const uploadRouter = require('./routes/uploadRoutes');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());

// routes

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blogcategory', blogCategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/upload', uploadRouter);

// error handling

app.use(notFound);
app.use(errorHandler);

// server

connectDB();
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`SV on PORT: ${PORT}`);
});
