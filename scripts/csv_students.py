#!/usr/bin/python3

import csv, random, time, fileinput, os

"""
HEADER: classroom, firstname, lastname, birthday, gender, email
"""

firstname_pool = [
    "gabbriello",
    "gino",
    "giacomo",
    "luisa",
    "mario",
    "daniele",
    "diego",
    "fabio",
    "guglielmo",
    "pippo",
    "serena",
    "giovanna",
    "ludovico",
    "graziella",
    "massimo",
    "maurizio",
    "zambio",
    "veronica",
    "sofia",
    "silvia",
    "elisa",
    "riccardo",
    "davide",
    "andrea",
    "luca",
    "lorenzo",
    "fabiana",
    "giulio",
    "michele",
    "michela",
    "giulia",
]

lastname_pool = [
    "rossi",
    "verdi",
    "bianchi",
    "smith",
    "pacco",
    "gustin",
    "novelli",
    "peric",
    "nkrtov",
    "nemesi",
    "franzoni",
    "degrassi",
    "caenazzo",
    "baruzza",
    "petronio",
    "ronchiato",
    "falanga",
    "dalvador",
    "bravin",
    "komauli",
    "bencina",
    "tence",
    "cesari",
    "panozzo",
    "dissegna",
    "banovaz",
    "zuccato",
    "driol",
    "vida",
    "dieselgaypeck",
    "furlan",
    "gallizia",
]

start_date = time.mktime(time.strptime("2000/01/01", "%Y/%m/%d"))
end_date = time.mktime(time.strptime("2005/01/01", "%Y/%m/%d"))


def get_classes():
    classes = []
    sections = ["A", "B", "C"]
    for i in range(3):
        for section in sections:
            classes.append(str(i + 1) + section)
    return classes


def generate_email(firstname, lastname, suffix=""):
    return firstname + "." + lastname + suffix + "@student.com"


def generate_random_date(start, end):
    ptime = start + random.random() * (end - start)
    return time.strftime("%Y/%m/%d", time.localtime(ptime))


good_students_range = (8, 10)
average_students_range = (6, 8)
bad_students_range = (3.5, 7)

trends = {
    "Math": {(8, 10): [1, 3, 9], (6, 8): [0, 2, 5, 6, 8], (3.5, 7): [4, 7]},
    "Art": {(8, 10): [3, 7, 4], (6, 8): [5, 1, 6, 0], (3.5, 7): [2, 9, 8]},
    "IT": {(8, 10): [5, 6], (6, 8): [3, 4, 9, 0], (3.5, 7): [1, 2, 7, 8]},
}


def main():
    students_buffer = []
    processed_emails = []
    with open("students.csv", mode="w", newline="") as students_file:
        classes = get_classes()
        genders = ["M", "F", "O"]
        fields = ["classroom", "firstname", "lastname", "birthday", "gender", "email"]
        writer = csv.DictWriter(students_file, fieldnames=fields)
        writer.writeheader()
        for c in classes:
            for i in range(10):
                random.shuffle(firstname_pool)
                random.shuffle(lastname_pool)
                random.shuffle(genders)
                firstname = firstname_pool[0]
                lastname = lastname_pool[0]
                email = ""
                same_email = True
                counter = 0
                while same_email:
                    email = generate_email(
                        firstname, lastname, (str(counter) if counter > 0 else "")
                    )
                    if email in processed_emails:
                        counter += 1
                    else:
                        same_email = False
                    processed_emails.append(email)
                student = {
                    "classroom": c,
                    "firstname": firstname_pool[0].capitalize(),
                    "lastname": lastname_pool[0].capitalize(),
                    "birthday": generate_random_date(start=start_date, end=end_date),
                    "gender": genders[0],
                    "email": email,
                }
                writer.writerow(student)
                students_buffer.append(student)

        for c in classes:
            students_in_class = [
                student for student in students_buffer if student["classroom"] == c
            ]
            for course in trends.keys():
                # good_students = [
                #     students_in_class[1],
                #     students_in_class[3],
                #     students_in_class[9],
                # ]
                # average_students = [
                #     students_in_class[0],
                #     students_in_class[2],
                #     students_in_class[5],
                #     students_in_class[6],
                #     students_in_class[8],
                # ]
                # bad_students = [students_in_class[4], students_in_class[7]]
                for i in range(10):
                    exam_date = generate_random_date(
                        time.mktime(time.strptime("2020/10/01", "%Y/%m/%d")),
                        time.mktime(time.strptime("2021/06/30", "%Y/%m/%d")),
                    )
                    with open(
                        "exams/" + "_".join([course, c, str(i)]) + ".csv", mode="w"
                    ) as exam_file:
                        writer = csv.DictWriter(
                            exam_file,
                            fieldnames=[
                                "STUDENT MAIL",
                                "TEACHER MAIL",
                                "COURSE",
                                "DATE",
                                "GRADE",
                                "WRITTEN",
                            ],
                        )
                        writer.writeheader()
                        for range_and_indexes in trends[course].items():
                            for index in range_and_indexes[1]:

                                #     print(students_in_class[range_and_indexes]["email"])
                                writer.writerow(
                                    {
                                        "STUDENT MAIL": students_in_class[index][
                                            "email"
                                        ],
                                        "TEACHER MAIL": "teacher@test.com",
                                        "COURSE": course,
                                        "DATE": exam_date,
                                        "GRADE": round(
                                            random.uniform(
                                                range_and_indexes[0][0],
                                                range_and_indexes[0][1],
                                            ),
                                            1,
                                        ),
                                        "WRITTEN": "S" if i % 2 == 0 else "N",
                                    }
                                )
                        # for student in trends[course][1]:
                        #     writer.writerow(
                        #         {
                        #             "STUDENT MAIL": students_in_class[index]["email"],
                        #             "TEACHER MAIL": "teacher@test.com",
                        #             "COURSE": course,
                        #             "DATE": exam_date,
                        #             "GRADE": round(
                        #                 random.uniform(
                        #                     average_students_range[0],
                        #                     average_students_range[1],
                        #                 ),
                        #                 1,
                        #             ),
                        #             "WRITTEN": "S" if i % 2 == 0 else "N",
                        #         }
                        #     )
                        # for student in trends[course][2]:
                        #     writer.writerow(
                        #         {
                        #             "STUDENT MAIL": students_in_class[index]["email"],
                        #             "TEACHER MAIL": "teacher@test.com",
                        #             "COURSE": course,
                        #             "DATE": exam_date,
                        #             "GRADE": round(
                        #                 random.uniform(
                        #                     bad_students_range[0], bad_students_range[1]
                        #                 ),
                        #                 1,
                        #             ),
                        #             "WRITTEN": "S" if i % 2 == 0 else "N",
                        #         }
                        #     )


if __name__ == "__main__":
    main()
