export default function Page() {
  const labels: Record<string, string> = {
    alerts:"알림", analytics:"분석", devices:"장치", groups:"그룹",
    restore:"복원", pulse:"펄스", lab:"실험실", addons:"추가 기능",
    integrations:"통합", account:"계정", settings:"설정",
  };
  const name = labels["alerts"] ?? "alerts";
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-foreground">{name}</h1>
      <p className="text-sm text-muted-foreground mt-1">이 페이지는 준비 중입니다.</p>
    </div>
  );
}
