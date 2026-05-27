# Dr. Hazem Clinic

واجهة موقع عيادة أسنان مبنية بـ `React + Vite + Tailwind CSS`.

## التشغيل المحلي

```bash
npm install
npm run dev
```

## البناء للإنتاج

```bash
npm run build
```

سينتج مجلد `dist` الجاهز للرفع.

## ملاحظات الرفع

- تم إضافة `public/_redirects` لاستضافة مثل Netlify.
- تم إضافة `public/.htaccess` لسيرفرات Apache/cPanel.
- تم إضافة `public/web.config` لسيرفرات IIS.
- لو السيرفر `Nginx` استخدم fallback إلى `/index.html` لأن المشروع يستخدم `BrowserRouter`.

## بيانات التواصل

البيانات الأساسية موجودة في [site.js](/c:/HazemClinic/src/config/site.js) ويمكن تعديلها قبل الرفع إذا احتجت تحديث الرقم أو البريد أو العنوان.
