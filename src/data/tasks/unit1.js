export const unit1 = {
  id: "unit-1",

  number: 1,

  titleNahuatl: "Timoixmatizceh",

  titleEnglish: "We will meet each other",

  sections: [
    {
      id: "1.3.3",

      number: "1.3.3",

      title: "Personal pronouns",

      description:
        "Practice the six independent personal pronouns used in this unit.",

      activities: [
        {
          id: "pronouns-sequence",

          type: "fill-sequence",

          instruction:
            "Complete the sequence of personal pronouns.",

          items: [
            {
              parts: [
                { text: "Na, " },

                {
                  blank: true,
                  answer: "ta"
                },

                { text: ", ya, " },

                {
                  blank: true,
                  answer: "tohhuantin"
                },

                { text: ", inmohhuantin, " },

                {
                  blank: true,
                  answer: "inihhuantin"
                }
              ]
            }
          ]
        },

        {
          id: "pronoun-identification",

          type: "short-answer",

          instruction:
            "Write the Nahuatl personal pronoun.",

          questions: [
            {
              prompt: "I",
              answer: "na"
            },

            {
              prompt: "you (singular)",
              answer: "ta"
            },

            {
              prompt: "he / she",
              answer: "ya"
            },

            {
              prompt: "we",
              answer: "tohhuantin"
            },

            {
              prompt: "you all",
              answer: "inmohhuantin"
            },

            {
              prompt: "they",
              answer: "inihhuantin"
            }
          ]
        },

        {
          id: "pronoun-reverse",

          type: "short-answer",

          instruction:
            "Give the English meaning.",

          questions: [
            {
              prompt: "Na",
              answer: "I"
            },

            {
              prompt: "Ta",
              answer: "you"
            },

            {
              prompt: "Ya",
              answer: "he/she"
            },

            {
              prompt: "Tohhuantin",
              answer: "we"
            },

            {
              prompt: "Inmohhuantin",
              answer: "you all"
            },

            {
              prompt: "Inihhuantin",
              answer: "they"
            }
          ]
        }
      ]
    }
  ]
};