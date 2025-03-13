import mongoose from "mongoose";

const subsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription must have the price"],
      min: 0,
      max: 1000,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
      required: [true, "Must specify the category"],
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date should be less than or equal to the current date",
      },
    },
    renewalDate: {
      type: Date,
      // required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date should be newer than start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

subsSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    if (this.frequency) {
      this.renewalDate = new Date(this.startDate);
      this.renewalDate.setDate(
        this.renewalDate.getDate() + renewalPeriods[this.frequency]
      );
    }
    if (this.renewalDate < new Date()) {
      this.status = "expired";
    }
  }
  next();
});

const Subscription = mongoose.model("Subscription", subsSchema);

export default Subscription;
