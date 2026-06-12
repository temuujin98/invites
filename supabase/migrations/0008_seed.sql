-- 0008: seed — 6 categories + 6 templates with full template_fields
-- Matches lib/mock-data.ts exactly so the app works immediately after migration.

-- ── Categories ────────────────────────────────────────────────────────────────
insert into public.categories (id, name_mn, name_en, slug, sort_order, is_active) values
  ('00000000-0000-0000-0000-000000000001', 'Төрсөн өдөр',          'Birthday',         'birthday',   1, true),
  ('00000000-0000-0000-0000-000000000002', 'Хуримын ёслол',         'Wedding',          'wedding',    2, true),
  ('00000000-0000-0000-0000-000000000003', 'Төгсөлтийн ёслол',      'Graduation',       'graduation', 3, true),
  ('00000000-0000-0000-0000-000000000004', 'Корпорейт арга хэмжээ', 'Corporate',        'corporate',  4, true),
  ('00000000-0000-0000-0000-000000000005', 'Хүүхдийн баяр',         'Kids party',       'kids',       5, true),
  ('00000000-0000-0000-0000-000000000006', 'Бусад арга хэмжээ',     'Other',            'other',      6, true)
on conflict (id) do nothing;

-- ── Templates ─────────────────────────────────────────────────────────────────
insert into public.templates (id, name, slug, category_id, type, canvas_width, canvas_height, status, is_pro) values
  ('10000000-0000-0000-0000-000000000001', 'Пастел төрсөн өдөр',    'birthday-pastel',    '00000000-0000-0000-0000-000000000001', 'image', 1080, 1920, 'published', false),
  ('10000000-0000-0000-0000-000000000002', 'Сонгодог хурим',         'wedding-classic',    '00000000-0000-0000-0000-000000000002', 'image', 1080, 1920, 'published', false),
  ('10000000-0000-0000-0000-000000000003', 'Тансаг хурим',           'wedding-luxury',     '00000000-0000-0000-0000-000000000002', 'image', 1080, 1920, 'published', true),
  ('10000000-0000-0000-0000-000000000004', 'Хүүхдийн баяр',          'birthday-kids',      '00000000-0000-0000-0000-000000000005', 'image', 1080, 1920, 'published', false),
  ('10000000-0000-0000-0000-000000000005', 'Орчин үеийн төгсөлт',   'graduation-modern',  '00000000-0000-0000-0000-000000000003', 'image', 1080, 1920, 'published', false),
  ('10000000-0000-0000-0000-000000000006', 'Корпорейт урилга',        'corporate-elegant',  '00000000-0000-0000-0000-000000000004', 'image', 1080, 1920, 'published', false)
on conflict (id) do nothing;

-- ── Template fields — birthday-pastel ─────────────────────────────────────────
insert into public.template_fields
  (id, template_id, key, label, placeholder, type, required, x, y, width, height, font_family, font_size, font_weight, line_height, max_chars, color, align, border_radius, object_fit, visible, locked, layer_order)
values
  ('f0010001-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','cover_image','Зураг',null,'image',false,0,100,1080,360,null,null,null,null,null,null,null,24,'cover',true,false,1),
  ('f0010002-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','event_title','Арга хэмжээний нэр','Анужин 6 нас','text',true,80,520,920,110,'Nunito',72,700,1.2,60,'#c2185b','center',null,null,true,false,2),
  ('f0010003-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','host_name','Зохион байгуулагчийн нэр','Дулмаагийн Анужин','text',true,80,660,920,80,'Montserrat',38,400,1.3,80,'#880e4f','center',null,null,true,false,3),
  ('f0010004-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','event_date','Огноо','2026-07-20','date',true,80,800,440,64,null,36,500,null,null,'#ad1457','center',null,null,true,false,4),
  ('f0010005-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','event_time','Цаг','14:00','time',true,560,800,440,64,null,36,500,null,null,'#ad1457','center',null,null,true,false,5),
  ('f0010006-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','location','Байршил','Улаанбаатар хот, Сүхбаатар дүүрэг','location',false,80,920,920,80,null,32,400,null,null,'#6d4c7d','center',null,null,true,false,6),
  ('f0010007-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','note','Нэмэлт мэдээлэл','Ирэхдээ бэлэг авчрахаа мартуузай!','text',false,80,1060,920,120,null,28,400,null,null,'#9c4488','center',null,null,true,false,7),
  ('f0010008-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','rsvp_button','RSVP товч',null,'rsvp',false,240,1720,600,96,null,36,600,null,null,'#ffffff','center',48,null,true,false,10)
on conflict (id) do nothing;

-- ── Template fields — wedding-classic ─────────────────────────────────────────
insert into public.template_fields
  (id, template_id, key, label, placeholder, type, required, x, y, width, height, font_family, font_size, font_weight, line_height, max_chars, color, align, border_radius, object_fit, visible, locked, layer_order)
values
  ('f0020001-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','cover_image','Зураг',null,'image',false,0,80,1080,400,null,null,null,null,null,null,null,null,'cover',true,false,1),
  ('f0020002-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','couple_names','Хосын нэр','Бат-Эрдэнэ & Солонго','text',true,80,540,920,120,'Playfair Display',68,700,1.25,50,'#2c1810','center',null,null,true,false,2),
  ('f0020003-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','event_title','Арга хэмжээний нэр','Хуримын ёслолд урьж байна','text',true,80,700,920,110,'Montserrat',40,400,1.2,60,'#5d4037','center',null,null,true,false,3),
  ('f0020004-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','host_name','Зохион байгуулагчийн нэр','Батын Болормаа','text',true,80,790,920,80,'Montserrat',34,400,1.3,80,'#795548','center',null,null,true,false,4),
  ('f0020005-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','event_date','Огноо','2026-08-15','date',true,80,920,440,64,null,36,500,null,null,'#4e342e','center',null,null,true,false,5),
  ('f0020006-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','event_time','Цаг','12:00','time',true,560,920,440,64,null,36,500,null,null,'#4e342e','center',null,null,true,false,6),
  ('f0020007-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','location','Байршил','Шангри-Ла зочид буудал, Улаанбаатар','location',false,80,1040,920,80,null,32,400,null,null,'#6d4c41','center',null,null,true,false,7),
  ('f0020008-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','qr_code','QR код',null,'qr',false,440,1560,200,200,null,null,null,null,null,null,null,null,null,true,true,9),
  ('f0020009-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','rsvp_button','RSVP товч',null,'rsvp',false,240,1720,600,96,null,36,600,null,null,'#ffffff','center',48,null,true,false,10)
on conflict (id) do nothing;

-- ── Template fields — wedding-luxury ──────────────────────────────────────────
insert into public.template_fields
  (id, template_id, key, label, placeholder, type, required, x, y, width, height, font_family, font_size, font_weight, line_height, max_chars, color, align, border_radius, object_fit, visible, locked, layer_order)
values
  ('f0030001-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','cover_image','Зураг',null,'image',false,0,0,1080,480,null,null,null,null,null,null,null,0,'cover',true,false,1),
  ('f0030002-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','couple_names','Хосын нэр','Энхбаяр & Номин','text',true,80,540,920,130,'Cormorant Garamond',76,700,1.2,50,'#b8960c','center',null,null,true,false,2),
  ('f0030003-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','tagline','Уриа үг','Хамт мөнхийн аялалд гарна','text',false,120,700,840,72,'Cormorant Garamond',36,400,null,null,'#c9a84c','center',null,null,true,false,3),
  ('f0030004-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','event_date','Огноо','2026-08-15','date',true,80,840,440,64,null,40,500,null,null,'#d4a93a','center',null,null,true,false,4),
  ('f0030005-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','event_time','Цаг','12:00','time',true,560,840,440,64,null,40,500,null,null,'#d4a93a','center',null,null,true,false,5),
  ('f0030006-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','location','Байршил','Шангри-Ла зочид буудал, Улаанбаатар','location',false,80,960,920,80,null,32,400,null,null,'#c9a84c','center',null,null,true,false,6),
  ('f0030007-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','host_name','Зохион байгуулагчийн нэр','Лувсандорж гэр бүл','text',true,80,1080,920,80,'Montserrat',34,400,1.3,80,'#c0954a','center',null,null,true,false,7),
  ('f0030008-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','qr_code','QR код',null,'qr',false,420,1540,200,200,null,null,null,null,null,null,null,null,null,true,true,9),
  ('f0030009-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','rsvp_button','RSVP товч',null,'rsvp',false,240,1720,600,96,null,36,600,null,null,'#1a1208','center',48,null,true,false,10)
on conflict (id) do nothing;

-- ── Template fields — birthday-kids ───────────────────────────────────────────
insert into public.template_fields
  (id, template_id, key, label, placeholder, type, required, x, y, width, height, font_family, font_size, font_weight, line_height, max_chars, color, align, border_radius, object_fit, visible, locked, layer_order)
values
  ('f0040001-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000004','cover_image','Зураг',null,'image',false,0,80,1080,340,null,null,null,null,null,null,null,32,'cover',true,false,1),
  ('f0040002-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000004','event_title','Арга хэмжээний нэр','Бат-Өлзий 5 нас','text',true,80,480,920,110,'Nunito',80,800,1.2,60,'#e91e63','center',null,null,true,false,2),
  ('f0040003-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000004','subtitle','Дэд гарчиг','Баяртай баярт тавтай морил!','text',false,80,610,920,72,'Nunito',38,600,null,null,'#9c27b0','center',null,null,true,false,3),
  ('f0040004-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000004','host_name','Зохион байгуулагчийн нэр','Мөнхөөгийн Бат-Өлзий','text',true,80,720,920,80,'Montserrat',null,400,1.3,80,'#7b1fa2','center',null,null,true,false,4),
  ('f0040005-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000004','event_date','Огноо','2026-07-20','date',true,80,840,440,64,null,36,500,null,null,'#1565c0','center',null,null,true,false,5),
  ('f0040006-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000004','event_time','Цаг','14:00','time',true,560,840,440,64,null,36,500,null,null,'#1565c0','center',null,null,true,false,6),
  ('f0040007-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000004','location','Байршил','Хүүхдийн цэцэрлэгт хүрээлэн, Хан-Уул дүүрэг','location',false,80,960,920,80,null,32,400,null,null,'#0277bd','center',null,null,true,false,7),
  ('f0040008-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000004','rsvp_button','RSVP товч',null,'rsvp',false,240,1720,600,96,null,36,600,null,null,'#ffffff','center',48,null,true,false,10)
on conflict (id) do nothing;

-- ── Template fields — graduation-modern ───────────────────────────────────────
insert into public.template_fields
  (id, template_id, key, label, placeholder, type, required, x, y, width, height, font_family, font_size, font_weight, line_height, max_chars, color, align, border_radius, object_fit, visible, locked, layer_order)
values
  ('f0050001-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','cover_image','Зураг',null,'image',false,0,60,1080,360,null,null,null,null,null,null,null,16,'cover',true,false,1),
  ('f0050002-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','event_title','Арга хэмжээний нэр','Төгсөлтийн ёслол 2026','text',true,80,480,920,110,'Montserrat',62,700,1.2,60,'#1a237e','center',null,null,true,false,2),
  ('f0050003-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','degree','Мэргэжил / Зэрэг','Програм хангамж инженерч','text',false,80,620,920,72,null,36,500,null,null,'#283593','center',null,null,true,false,3),
  ('f0050004-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','host_name','Зохион байгуулагчийн нэр','Гантулгын Цэнгэл','text',true,80,730,920,80,'Montserrat',36,400,1.3,80,'#3949ab','center',null,null,true,false,4),
  ('f0050005-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','event_date','Огноо','2026-07-05','date',true,80,860,440,64,null,36,500,null,null,'#1a237e','center',null,null,true,false,5),
  ('f0050006-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','event_time','Цаг','10:00','time',true,560,860,440,64,null,36,500,null,null,'#1a237e','center',null,null,true,false,6),
  ('f0050007-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','location','Байршил','МУИС-ийн их танхим, Сүхбаатар дүүрэг','location',false,80,980,920,80,null,32,400,null,null,'#3f51b5','center',null,null,true,false,7),
  ('f0050008-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','qr_code','QR код',null,'qr',false,420,1540,200,200,null,null,null,null,null,null,null,null,null,true,true,9),
  ('f0050009-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000005','rsvp_button','RSVP товч',null,'rsvp',false,240,1720,600,96,null,36,600,null,null,'#ffffff','center',48,null,true,false,10)
on conflict (id) do nothing;

-- ── Template fields — corporate-elegant ───────────────────────────────────────
insert into public.template_fields
  (id, template_id, key, label, placeholder, type, required, x, y, width, height, font_family, font_size, font_weight, line_height, max_chars, color, align, border_radius, object_fit, visible, locked, layer_order)
values
  ('f0060001-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','company_logo','Компанийн лого',null,'image',false,390,100,300,160,null,null,null,null,null,null,null,null,'contain',true,false,1),
  ('f0060002-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','event_title','Арга хэмжээний нэр','Жилийн тайлант хурал 2026','text',true,80,320,920,130,'Montserrat',58,700,1.2,60,'#0d1b2a','center',null,null,true,false,2),
  ('f0060003-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','organization','Байгууллагын нэр','Монгол Телеком ХК','text',true,80,490,920,72,null,38,600,null,null,'#1b3a5c','center',null,null,true,false,3),
  ('f0060004-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','host_name','Зохион байгуулагчийн нэр','Гүйцэтгэх захирал: Д. Мөнхбаяр','text',true,80,600,920,80,'Montserrat',34,400,1.3,80,'#2c5282','center',null,null,true,false,4),
  ('f0060005-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','event_date','Огноо','2026-09-10','date',true,80,740,440,64,null,36,500,null,null,'#1a3c5e','center',null,null,true,false,5),
  ('f0060006-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','event_time','Цаг','09:00','time',true,560,740,440,64,null,36,500,null,null,'#1a3c5e','center',null,null,true,false,6),
  ('f0060007-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','location','Байршил','Кемпински зочид буудал, Хан-Уул дүүрэг','location',false,80,860,920,80,null,32,400,null,null,'#2a4a6b','center',null,null,true,false,7),
  ('f0060008-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','dress_code','Хувцасны дресс-код','Ёслолын хувцас','custom',false,80,1000,920,60,null,30,400,null,null,'#4a6080','center',null,null,true,false,8),
  ('f0060009-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','qr_code','QR код',null,'qr',false,440,1560,200,200,null,null,null,null,null,null,null,null,null,true,true,9),
  ('f0060010-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000006','rsvp_button','RSVP товч',null,'rsvp',false,240,1720,600,96,null,36,600,null,null,'#ffffff','center',48,null,true,false,10)
on conflict (id) do nothing;

-- ── Admin user setup instructions ─────────────────────────────────────────────
-- To make a user an admin, run this SQL in the Supabase Dashboard SQL editor
-- (replace the email address with the actual admin's email):
--
--   update public.profiles
--   set role = 'admin'
--   where id = (
--     select id from auth.users where email = 'your-admin@example.com'
--   );
--
-- The user must have registered first via /register (which triggers handle_new_user).
