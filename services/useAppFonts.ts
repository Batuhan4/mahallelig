// Artık özel font yükleme YOK — tüm tipografi sistem fontuna döner.
// iOS'ta `fontFamily: "System"` otomatik olarak San Francisco Pro'ya çözülür.
// Android'de Roboto, web'de tarayıcı varsayılanı kullanılır.
// Mono semantiği `fontFamily: "Menlo"` ile (iOS'un sistem mono fontu) korunur.
//
// Hook'un imzası backwards-compat için aynı bırakıldı: [loaded, error?].
// İlk render'da loaded=true döner, splash hemen kapanır.

export function useAppFonts(): [boolean] {
  return [true];
}
