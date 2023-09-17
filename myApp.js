require("dotenv").config();
const { query } = require("express");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) =>
    console.log(` connected to db: ${connection.connection.host}`)
  )
  .catch((err) => console.log(err));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 0,
  },
  favoriteFoods: [String],
});

let Person;

const PersonModel = mongoose.model("Person", personSchema);

Person = PersonModel;

const arrayOfPeople = [
  {
    name: "Mary",
    age: 20,
    favoriteFoods: ["burrito", "pizza"],
  },
  {
    name: "John",
    age: 21,
    favoriteFoods: ["burrito", "pizza"],
  },
  {
    name: "Joe",
    age: 21,
    favoriteFoods: ["burrito", "pizza"],
  },
  {
    name: "Jude",
    age: 21,
    favoriteFoods: ["burrito", "pizza"],
  },
  {
    name: "joey",
    age: 21,
    favoriteFoods: ["burrito", "pizza"],
  },
];

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Mary",
    age: 20,
    favoriteFoods: ["burrito", "pizza"],
  });

  person.save((err, data) => {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: { $in: [food] } }, (err, data) => {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, data) => {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    data.favoriteFoods.push(foodToAdd);
    // data.favoriteFoods = [];

    data.markModified("favoriteFoods");

    data.save((err, data) => {
      if (err) {
        console.log(err);
        return done(err, null);
      }
      done(null, data);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { $set: { age: ageToSet } },
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
        return done(err, null);
      }
      done(null, data);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    done(null, data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, (err, data) => {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    done(null, data);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: { $in: [foodToSearch] } })
    .sort({ name: 1 })
    .limit(2)
    .select("-age")
    .exec((err, data) => {
      if (err) {
        console.log(err);
        return done(err, null);
      }
      done(null, data);
    });
};

const findAllPeople = (done) => {
  Person.find((err, data) => {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    done(null, data);
  });
};

const findAllPeopleAndDelete = (done) => {
  Person.find((err, data) => {
    if (err) {
      return done(err);
    }
    data.forEach((person) => {
      Person.remove((err, data) => {
        if (err) {
          return done(err);
        }
        done(data);
        console.log(`deleted ${person.name}`);
      });
    });
  });
};

// queryChain((err, data) => {
//   if (err) {
//     return console.log(err);
//   }
//   console.log(data);
// });

// removeManyPeople((err, data) => {
//   console.log(data);
// })

// findOneByFood("burrito", (err, data) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   findEditThenSave(data._id, function (err, data) {
//     if (err) {
//       return next(err);
//     }
//     if (!data) {
//       console.log("Missing `done()` argument");
//       return next({ message: "Missing callback argument" });
//     }
//     console.log(data);
//   });
// });

// findAllPeople((data) => {
//   console.log(data);
// });

// findPeopleByName("Mary", (err, data) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(data);
// })

// createManyPeople(arrayOfPeople, (err, data) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(data);
// })

// createAndSavePerson(function (err, data) {
//   if (err) {
//     console.log(err);
//   }
//   if (!data) {
//     console.log("Missing `done()` argument");
//     return console.log({ message: "Missing callback argument" });
//   }
//   Person.findById(data._id, function (err, pers) {
//     if (err) {
//       console.log(err);
//     }
//     console.log(pers);
//     pers.remove();
//   });
// });

// findAllPeopleAndDelete((data) => {
//   console.log(data);
// });

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
