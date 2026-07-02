import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Нууцлалын бодлого · invites.mn",
  description: "invites.mn платформ хэрэглэгчийн мэдээллийг хэрхэн цуглуулж, ашигладаг тухай.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="text-2xl font-bold text-(--color-text) md:text-3xl">
        Нууцлалын бодлого
      </h1>
      <p className="mt-2 text-sm text-(--color-text-muted)">
        Сүүлд шинэчилсэн: 2026.07.02
      </p>

      <div className="mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-(--color-text-secondary)">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-text)">1. Цуглуулах мэдээлэл</h2>
          <p>
            Бид үйлчилгээ үзүүлэхэд шаардлагатай мэдээллийг цуглуулна: бүртгэлийн и-мэйл хаяг, нэр,
            таны үүсгэсэн урилгын агуулга (текст, зураг, огноо, байршил). Урилгад хариу өгсөн
            зочдын нэр, ирэх эсэх сонголтыг мөн хадгална.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-text)">2. Мэдээллийг ашиглах</h2>
          <p>
            Цуглуулсан мэдээллийг зөвхөн үйлчилгээ үзүүлэх — урилга үүсгэх, хуваалцах, RSVP хариу
            цуглуулах зорилгоор ашиглана. Бид таны хувийн мэдээллийг гуравдагч этгээдэд зарж
            борлуулахгүй.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-text)">3. Нийтийн урилга</h2>
          <p>
            Та урилгаа нийтийн холбоосоор хуваалцсан тохиолдолд тухайн холбоостой хэн ч урилгын
            агуулгыг үзэх боломжтой болно. Урилгаа хувийн болгох, эсвэл архивлах сонголт таны гарт
            байна.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-text)">4. Мэдээлэл хадгалалт ба хамгаалалт</h2>
          <p>
            Таны мэдээллийг найдвартай дэд бүтэц (Supabase) дээр хадгалж, хандалтыг эрхийн түвшингээр
            хязгаарладаг. Бид мэдээллийг зохих ёсоор хамгаалахыг эрмэлзэх боловч интернэтээр дамжих
            мэдээллийн 100% аюулгүй байдлыг баталгаажуулах боломжгүй.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-text)">5. Таны эрх</h2>
          <p>
            Та өөрийн бүртгэл, урилга, цуглуулсан мэдээллийг устгах хүсэлт гаргах эрхтэй. Хүсэлт,
            асуултаа{" "}
            <a href="mailto:tuslamj@invites.mn" className="text-(--color-accent) hover:underline">
              tuslamj@invites.mn
            </a>{" "}
            хаягаар илгээнэ үү.
          </p>
        </section>
      </div>
    </main>
  );
}
