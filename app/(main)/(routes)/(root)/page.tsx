import React from "react";
import { db } from "@/lib/db";
import { Category } from "./_components/Category";
import { Carousel } from "./_components/Carousel";
import { Category2 } from "./_components/Category2";
import { CourseList } from "./_components/CourseList";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { MainLoadingPage } from "@/components/loadingpage/MainLoadingPage";

export default async function Main() {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const course = await db.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      category: true,
      chapters: true,
    },
    take: 10,
    orderBy: { id: "asc" },
  });

  const category = await db.category.findMany({
    orderBy: {
      name: "desc",
    },
  });

  const purchased = await db.purchase.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="flex flex-col w-full h-auto min-h-screen">
      <Category
        category={category.map((cat: typeof category[number]) => ({
          id: cat.id,
          name: cat.name,
        }))}
      />
      <Carousel />
      {course.length == 0 ? (
        <MainLoadingPage />
      ) : (
        <div className="flex flex-col space-y-8 px-5 lg:px-16">
          <h1 className="text-4xl font-extrabold">What to learn next</h1>
          <div className="flex flex-col gap-y-4 justify-start items-start">
            <h4 className="text-2xl font-semibold">
              Recommended for you!{" "}
              <span className="text-blue-700 underline">
                &quot;learn and grow your skills!!!&quot;
              </span>
            </h4>
            <CourseList
              coursesData={course.map((courseItem: typeof course[number]) => ({
                id: courseItem.id,
                title: courseItem.title,
                imageUrl: courseItem.imageUrl,
                category: courseItem.category?.name,
                chapters: courseItem.chapters.length,
                price: courseItem.price,
              }))}
              purchased={purchased}
            />
          </div>
          <div className="flex flex-col gap-y-4 justify-start items-start">
            <h4 className="text-2xl font-semibold">
              Topics recommended for you
            </h4>
            <Category2
              category={category.map((cat2: typeof category[number]) => ({
                id: cat2.id,
                name: cat2.name,
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}