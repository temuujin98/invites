import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Үйлчилгээний нөхцөл · invites.mn",
  description: "invites.mn платформын үйлчилгээний нөхцөл.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="text-2xl font-bold text-(--color-text) md:text-3xl">
        Үйлчилгээний нөхцөл
      </h1>
      <p className="mt-2 text-sm text-(--color-text-muted)">
        Сүүлд шинэчилсэн: 2026.07.02
      </p>

      <div className="mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-(--color-text-secondary)">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-text)">1. Ерөнхий заалт</h2>
          <p>
            invites.mn (цаашид &laquo;Платформ&raquo; гэх) нь цахим урилга үүсгэх, хуваалцах
            үйлчилгээ үзүүлдэг. Та Платформыг ашигласнаар энэхүү нөхцөлийг хүлээн зөвшөөрсөнд
            тооцно. Хэрэв та нөхцөлтэй санал нийлэхгүй бол үйлчилгээг ашиглахгүй байхыг хүсье.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-text)">2. Бүртгэл ба хэрэглэгчийн үүрэг</h2>
          <p>
            Та бүртгэл үүсгэхдээ үнэн зөв мэдээлэл өгөх үүрэгтэй. Нэвтрэх нэр, нууц үгээ хамгаалах,
            бусдад дамжуулахгүй байх нь таны хариуцлага. Бүртгэлээр дамжуулан хийгдсэн үйлдлийн
            хариуцлагыг та хүлээнэ.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-text)">3. Контентийн хариуцлага</h2>
          <p>
            Та өөрийн үүсгэсэн урилга, түүнд орсон зураг, текст зэрэг контентийн хууль ёсны эрхийг
            эзэмшсэн байх ёстой. Бусдын оюуны өмч, нэр төрд халдсан, хууль бус контент байршуулахыг
            хориглоно. Ийм контентийг Платформ урьдчилан мэдэгдэлгүйгээр устгах эрхтэй.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-text)">4. Үйлчилгээний хүртээмж</h2>
          <p>
            Бид үйлчилгээг тасралтгүй үзүүлэхийг эрмэлзэх боловч техникийн засвар үйлчилгээ, эсвэл
            бидний хяналтаас гадуурх шалтгаанаар түр тасалдах магадлалтай. Ийм тасалдлаас үүдэх
            хохирлыг Платформ хариуцахгүй.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-text)">5. Нөхцөлийн өөрчлөлт</h2>
          <p>
            Платформ энэхүү нөхцөлийг шаардлагатай үед шинэчлэх эрхтэй. Өөрчлөлт орсон тохиолдолд
            энэ хуудсанд шинэчилсэн огноог тэмдэглэнэ. Асуулт байвал{" "}
            <a href="mailto:tuslamj@invites.mn" className="text-(--color-accent) hover:underline">
              tuslamj@invites.mn
            </a>{" "}
            хаягаар холбогдоно уу.
          </p>
        </section>
      </div>
    </main>
  );
}
