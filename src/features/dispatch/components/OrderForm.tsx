import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Job, TripLeg } from "../types/dispatch";
import styles from "./OrderForm.module.css";

// --- マスタデータ ---

const LOCATIONS: string[] = [
  "アクティオ高知",
  "ナガワ高知営業所",
  "早明浦ダム大林組現場",
  "高知港",
  "南国サービスエリア",
];

const DRIVER_VEHICLES: Record<string, string> = {
  "1": "v1",
  "2": "v2",
  "3": "v3",
};

const DRIVERS = [
  { id: "1", name: "田中 太郎" },
  { id: "2", name: "山本 次郎" },
  { id: "3", name: "佐藤 三郎" },
];

const VEHICLES = [
  { id: "v1", plate: "高知 100 あ 1234" },
  { id: "v2", plate: "高知 200 い 5678" },
  { id: "v3", plate: "高知 300 う 9012" },
];

const CATEGORIES: Record<string, string[]> = {
  発電機: [
    "3kva発電機",
    "13kva発電機",
    "25kva発電機",
    "45kva発電機",
    "100kva発電機",
    "125kva発電機",
    "25kvaオイルフェンス一体型",
  ],
  仮設ハウス: ["2坪ハウス", "4坪ハウス", "6坪ハウス", "トイレハウス"],
  重機: [
    "バックホウ0.45",
    "バックホウ0.7",
    "クローラークレーン",
    "ホイールローダー",
  ],
  資材: ["鉄板", "単管", "足場材", "ガードレール"],
  未分類: [],
};

// --- Zodスキーマ ---

const cargoSchema = z.object({
  descMode: z.enum(["select", "input"]),
  category: z.string(),
  desc: z.string().min(1, "荷物名を入力してください"),
  qty: z.string().min(1, "個数を入力してください"),
  weight: z.string().min(1, "重量を入力してください"),
  saveCargo: z.boolean(),
  saveCategory: z.string(),
});

const deliverySchema = z.object({
  pickupMode: z.enum(["select", "input"]),
  pickup: z.string().min(1, "積み地を選択または入力してください"),
  pickupSave: z.boolean(),
  deliveryMode: z.enum(["select", "input"]),
  delivery: z.string().min(1, "降ろし地を選択または入力してください"),
  deliverySave: z.boolean(),
  scheduledTime: z.string(),
  cargos: z.array(cargoSchema).min(1),
});

const orderSchema = z.object({
  title: z.string(),
  note: z.string(),
  planDate: z.string().min(1, "作業日を選択してください"),
  departTime: z.string().min(1, "出発時刻を入力してください"),
  endTime: z.string().min(1, "終了時刻を入力してください"),
  driverId: z.string().min(1, "ドライバーを選択してください"),
  vehicleId: z.string().min(1, "車番を選択してください"),
  unifiedArrival: z.string(),
  individualTime: z.boolean(),
  deliveries: z.array(deliverySchema).min(1, "配達を1件以上追加してください"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

// --- デフォルト値 ---

const defaultCargo = (): OrderFormValues["deliveries"][0]["cargos"][0] => ({
  descMode: "select",
  category: "",
  desc: "",
  qty: "",
  weight: "",
  saveCargo: false,
  saveCategory: "未分類",
});

const defaultDelivery = (): OrderFormValues["deliveries"][0] => ({
  pickupMode: "select",
  pickup: "",
  pickupSave: false,
  deliveryMode: "select",
  delivery: "",
  deliverySave: false,
  scheduledTime: "",
  cargos: [defaultCargo()],
});

// --- Props ---

interface OrderFormProps {
  mode: "add" | "edit";
  job?: Job;
  onClose: () => void;
  onAdd?: (job: Job) => void;
  onUpdate?: (job: Job) => void;
  onDelete?: () => void;
}

// --- エラーメッセージ ---

function ErrorMsg({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={styles.errorMsg}>{message}</p>;
}

// --- トグルボタン ---

interface ToggleBtnProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

function ToggleBtn({ options, value, onChange }: ToggleBtnProps) {
  return (
    <div className={styles.toggleRow}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`${styles.toggleBtn} ${value === opt.value ? styles.toggleBtnActive : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// --- 荷物アイテム ---

interface CargoItemProps {
  deliveryIndex: number;
  cargoIndex: number;
  control: ReturnType<typeof useForm<OrderFormValues>>["control"];
  register: ReturnType<typeof useForm<OrderFormValues>>["register"];
  setValue: ReturnType<typeof useForm<OrderFormValues>>["setValue"];
  errors: ReturnType<typeof useForm<OrderFormValues>>["formState"]["errors"];
  onRemove: () => void;
  showRemove: boolean;
}

function CargoItem({
  deliveryIndex,
  cargoIndex,
  control,
  register,
  setValue,
  errors,
  onRemove,
  showRemove,
}: CargoItemProps) {
  const baseName = `deliveries.${deliveryIndex}.cargos.${cargoIndex}` as const;
  const descMode = useWatch({ control, name: `${baseName}.descMode` });
  const category = useWatch({ control, name: `${baseName}.category` });
  const saveCargo = useWatch({ control, name: `${baseName}.saveCargo` });
  const cargoError = errors.deliveries?.[deliveryIndex]?.cargos?.[cargoIndex];

  return (
    <div className={styles.cargoItem}>
      {showRemove && (
        <button className={styles.cargoRemove} onClick={onRemove} type="button">
          ✕
        </button>
      )}
      <ToggleBtn
        options={[
          { value: "select", label: "選択" },
          { value: "input", label: "手入力" },
        ]}
        value={descMode}
        onChange={(v) =>
          setValue(`${baseName}.descMode`, v as "select" | "input")
        }
      />
      {descMode === "select" ? (
        <div className={styles.cargoRowWrap}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>カテゴリ</label>
              <select
                className={styles.input}
                {...register(`${baseName}.category`)}
                onChange={(e) => {
                  setValue(`${baseName}.category`, e.target.value);
                  setValue(`${baseName}.desc`, "");
                }}
              >
                <option value="">カテゴリを選択</option>
                {Object.keys(CATEGORIES).map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>荷物</label>
              <select
                className={styles.input}
                {...register(`${baseName}.desc`)}
                disabled={!category || !CATEGORIES[category]?.length}
              >
                <option value="">
                  {!category ? "（カテゴリを先に選択）" : "荷物を選択"}
                </option>
                {(CATEGORIES[category] ?? []).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ErrorMsg message={cargoError?.desc?.message} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.cargoDescWrap}>
          <label className={styles.label}>荷物名</label>
          <input
            className={styles.input}
            type="text"
            placeholder="例：25kva発電機"
            {...register(`${baseName}.desc`)}
          />
          <ErrorMsg message={cargoError?.desc?.message} />
          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              id={`${baseName}.saveCargo`}
              className={styles.checkbox}
              {...register(`${baseName}.saveCargo`)}
            />
            <label
              htmlFor={`${baseName}.saveCargo`}
              className={styles.labelClickable}
            >
              よく使う荷物として登録する
            </label>
          </div>
          {saveCargo && (
            <div className={styles.saveCatWrap}>
              <label className={styles.label}>カテゴリ</label>
              <select
                className={styles.saveCatSelect}
                {...register(`${baseName}.saveCategory`)}
              >
                <option>未分類</option>
                {Object.keys(CATEGORIES).map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>個数</label>
          <input
            className={styles.input}
            type="number"
            placeholder="1"
            min={1}
            {...register(`${baseName}.qty`)}
          />
          <ErrorMsg message={cargoError?.qty?.message} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>重量 (kg)</label>
          <input
            className={styles.input}
            type="number"
            placeholder="0"
            {...register(`${baseName}.weight`)}
          />
          <ErrorMsg message={cargoError?.weight?.message} />
        </div>
      </div>
    </div>
  );
}

// --- 配達カード ---

interface DeliveryCardProps {
  deliveryIndex: number;
  control: ReturnType<typeof useForm<OrderFormValues>>["control"];
  register: ReturnType<typeof useForm<OrderFormValues>>["register"];
  setValue: ReturnType<typeof useForm<OrderFormValues>>["setValue"];
  errors: ReturnType<typeof useForm<OrderFormValues>>["formState"]["errors"];
  onRemove: () => void;
  showIndividualTime: boolean;
}

function DeliveryCard({
  deliveryIndex,
  control,
  register,
  setValue,
  errors,
  onRemove,
  showIndividualTime,
}: DeliveryCardProps) {
  const baseName = `deliveries.${deliveryIndex}` as const;
  const pickupMode = useWatch({ control, name: `${baseName}.pickupMode` });
  const deliveryMode = useWatch({ control, name: `${baseName}.deliveryMode` });

  const {
    fields: cargoFields,
    append: appendCargo,
    remove: removeCargo,
  } = useFieldArray({
    control,
    name: `${baseName}.cargos`,
  });

  const deliveryError = errors.deliveries?.[deliveryIndex];

  return (
    <div className={styles.deliveryCard}>
      <div className={styles.deliveryNum}>配達 {deliveryIndex + 1}</div>
      <button className={styles.removeBtn} onClick={onRemove} type="button">
        ✕
      </button>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>積み地</label>
          <ToggleBtn
            options={[
              { value: "select", label: "選択" },
              { value: "input", label: "手入力" },
            ]}
            value={pickupMode}
            onChange={(v) =>
              setValue(`${baseName}.pickupMode`, v as "select" | "input")
            }
          />
          {pickupMode === "select" ? (
            <select
              className={styles.input}
              {...register(`${baseName}.pickup`)}
            >
              <option value="">場所を選択</option>
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          ) : (
            <>
              <input
                className={styles.input}
                type="text"
                placeholder="場所名を入力"
                {...register(`${baseName}.pickup`)}
              />
              <div className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  id={`${baseName}.pickupSave`}
                  className={styles.checkbox}
                  {...register(`${baseName}.pickupSave`)}
                />
                <label
                  htmlFor={`${baseName}.pickupSave`}
                  className={styles.labelClickable}
                >
                  よく使う場所として登録する
                </label>
              </div>
            </>
          )}
          <ErrorMsg message={deliveryError?.pickup?.message} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>降ろし地</label>
          <ToggleBtn
            options={[
              { value: "select", label: "選択" },
              { value: "input", label: "手入力" },
            ]}
            value={deliveryMode}
            onChange={(v) =>
              setValue(`${baseName}.deliveryMode`, v as "select" | "input")
            }
          />
          {deliveryMode === "select" ? (
            <select
              className={styles.input}
              {...register(`${baseName}.delivery`)}
            >
              <option value="">場所を選択</option>
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          ) : (
            <>
              <input
                className={styles.input}
                type="text"
                placeholder="場所名を入力"
                {...register(`${baseName}.delivery`)}
              />
              <div className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  id={`${baseName}.deliverySave`}
                  className={styles.checkbox}
                  {...register(`${baseName}.deliverySave`)}
                />
                <label
                  htmlFor={`${baseName}.deliverySave`}
                  className={styles.labelClickable}
                >
                  よく使う場所として登録する
                </label>
              </div>
            </>
          )}
          <ErrorMsg message={deliveryError?.delivery?.message} />
        </div>
      </div>

      {showIndividualTime && (
        <div className={styles.rowMarginTop}>
          <div className={styles.field}>
            <label className={styles.label}>到着時刻</label>
            <input
              className={styles.input}
              type="time"
              {...register(`${baseName}.scheduledTime`)}
            />
          </div>
        </div>
      )}

      <div className={styles.cargoWrap}>
        <div className={styles.cargoLabel}>荷物</div>
        {cargoFields.map((field, ci) => (
          <CargoItem
            key={field.id}
            deliveryIndex={deliveryIndex}
            cargoIndex={ci}
            control={control}
            register={register}
            setValue={setValue}
            errors={errors}
            onRemove={() => removeCargo(ci)}
            showRemove={cargoFields.length > 1}
          />
        ))}
        <button
          className={styles.addBtnSm}
          onClick={() => appendCargo(defaultCargo())}
          type="button"
        >
          ＋ 荷物を追加
        </button>
      </div>
    </div>
  );
}

// --- ルートプレビュー ---

interface RoutePoint {
  name: string;
  type: "pickup" | "delivery";
}

function RoutePreview({
  deliveries,
}: {
  deliveries: OrderFormValues["deliveries"];
}) {
  const [routeOrder, setRouteOrder] = useState<RoutePoint[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const points: RoutePoint[] = [];
  deliveries.forEach((d) => {
    if (d.pickup && !points.find((p) => p.name === d.pickup))
      points.push({ name: d.pickup, type: "pickup" });
    if (d.delivery && !points.find((p) => p.name === d.delivery))
      points.push({ name: d.delivery, type: "delivery" });
  });

  const displayPoints =
    routeOrder.length > 0 && routeOrder.length === points.length
      ? routeOrder
      : points;

  if (points.length === 0) {
    return (
      <div className={styles.routePreview}>
        <p className={styles.routeEmpty}>
          配達を追加するとルートが表示されます
        </p>
      </div>
    );
  }

  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const arr = [...displayPoints];
    const moved = arr.splice(dragIdx, 1)[0];
    arr.splice(targetIdx, 0, moved);
    setRouteOrder(arr);
    setDragIdx(null);
  };

  return (
    <div className={styles.routePreview}>
      <div className={styles.routePreviewTitle}>
        地点一覧（ドラッグで順番変更）
      </div>
      {displayPoints.map((p, i) => (
        <div
          key={p.name}
          draggable
          onDragStart={() => setDragIdx(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(i)}
          className={[
            styles.routeItem,
            i < displayPoints.length - 1 ? styles.routeItemBorder : "",
            dragIdx === i ? styles.routeItemDragging : "",
          ].join(" ")}
        >
          <span className={styles.routeHandle}>⠿</span>
          <span className={styles.routeSeq}>{i + 1}</span>
          <span
            className={`${styles.routeDot} ${p.type === "pickup" ? styles.routeDotPickup : styles.routeDotDelivery}`}
          />
          <span className={styles.routeName}>{p.name}</span>
          <span
            className={
              p.type === "pickup" ? styles.badgePickup : styles.badgeDelivery
            }
          >
            {p.type === "pickup" ? "積み" : "降ろし"}
          </span>
        </div>
      ))}
    </div>
  );
}

// --- メインコンポーネント ---

export default function OrderForm({
  mode,
  job,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
}: OrderFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues:
  mode === "edit" && job
    ? {
        title: job.title ?? "",
        note: job.note ?? "",
        planDate: job.planDate ?? "",
        departTime: `${String(job.startHour).padStart(2, "0")}:${String(job.startMinute).padStart(2, "0")}`,
        endTime: `${String(job.endHour).padStart(2, "0")}:${String(job.endMinute).padStart(2, "0")}`,
        driverId: job.driverId ?? "",
        vehicleId: job.vehicleId ?? "",
        unifiedArrival: "",
        individualTime: false,
        deliveries: job.tripLegs && job.tripLegs.length > 0
          ? job.tripLegs.map((leg) => ({
              pickupMode: "select" as const,
              pickup: leg.route.split(" → ")[0] ?? "",
              pickupSave: false,
              deliveryMode: "select" as const,
              delivery: leg.route.split(" → ")[1] ?? "",
              deliverySave: false,
              scheduledTime: leg.time ?? "",
              cargos: [{
                descMode: "select" as const,
                category: "",
                desc: leg.cargo ?? "",
                qty: "1",
                weight: leg.weight?.replace("kg", "") ?? "",
                saveCargo: false,
                saveCategory: "未分類",
              }],
            }))
          : [defaultDelivery()],
      }
        : {
            title: "",
            note: "",
            planDate: "",
            departTime: "",
            endTime: "",
            driverId: "",
            vehicleId: "",
            unifiedArrival: "",
            individualTime: false,
            deliveries: [defaultDelivery()],
          },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "deliveries",
  });

  const departTime = watch("departTime");
  const endTime = watch("endTime");
  const individualTime = watch("individualTime");
  const deliveries = watch("deliveries");

  const ganttVisible = (() => {
    if (!departTime || !endTime) return false;
    const [dh, dm] = departTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    return eh * 60 + em > dh * 60 + dm;
  })();

  const ganttText = (() => {
    if (!ganttVisible) return "";
    const [dh, dm] = departTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const mins = eh * 60 + em - (dh * 60 + dm);
    return `${Math.floor(mins / 60)}時間${mins % 60 ? (mins % 60) + "分" : ""}`;
  })();

  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setValue("driverId", id);
    const vid = DRIVER_VEHICLES[id];
    if (vid) setValue("vehicleId", vid);
  };

  // const onSubmit = (data: OrderFormValues) => {
  //   const [sh, sm] = data.departTime.split(":").map(Number);
  //   const [eh, em] = data.endTime.split(":").map(Number);
  //   const jobData: Job = {
  //     id: job?.id ?? crypto.randomUUID(),
  //     vehicleId: data.vehicleId,
  //     title:
  //       data.title ||
  //       `${data.deliveries[0]?.pickup ?? ""}→${data.deliveries[0]?.delivery ?? ""}`,
  //     startHour: sh,
  //     startMinute: sm,
  //     endHour: eh,
  //     endMinute: em,
  //   };
  //   if (mode === "add") {
  //     onAdd?.(jobData);
  //   } else {
  //     onUpdate?.(jobData);
  //   }
  //   onClose();
  // };
  const onSubmit = (data: OrderFormValues) => {
    console.log("① フォームの入力値 data", data);
    const [sh, sm] = data.departTime.split(":").map(Number);
    const [eh, em] = data.endTime.split(":").map(Number);

    // deliveriesからtripLegsを生成
    const tripLegs: TripLeg[] = data.deliveries.map((d, i) => ({
      legNumber: i + 1,
      route: `${d.pickup} → ${d.delivery}`,
      time: data.individualTime ? d.scheduledTime : data.unifiedArrival,
      cargo: d.cargos
        .map((c) => c.desc)
        .filter(Boolean)
        .join("、"),
      weight: d.cargos
        .map((c) => c.weight)
        .filter(Boolean)
        .map((w) => `${w}kg`)
        .join("、"),
      status: "積荷あり",
    }));

    console.log("② 変換後 tripLegs", tripLegs);

    // タイトル自動生成
    const pickups = [...new Set(data.deliveries.map((d) => d.pickup))].join(
      "・",
    );
    const destinations = [
      ...new Set(data.deliveries.map((d) => d.delivery)),
    ].join("・");
    const autoTitle = `${pickups} → ${destinations}`;

    const jobData: Job = {
      id: job?.id ?? crypto.randomUUID(),
      vehicleId: data.vehicleId,
      title: data.title || autoTitle,
      startHour: sh,
      startMinute: sm,
      endHour: eh,
      endMinute: em,
      driverId: data.driverId,
      planDate: data.planDate,
      note: data.note,
      tripLegs,
    };

    console.log("③ 最終 jobData", jobData);

    if (mode === "add") {
      onAdd?.(jobData);
    } else {
      onUpdate?.(jobData);
    }
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            {mode === "add" ? "案件登録" : "案件編集"}
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.section}>
            <div className={styles.sectionLabel}>基本情報</div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>案件名（任意）</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="空欄の場合は自動生成されます"
                  {...register("title")}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>備考</label>
                <textarea
                  className={styles.textarea}
                  placeholder="例：現場担当：田中様、正門から入って右手の建屋"
                  {...register("note")}
                />
              </div>
            </div>

            <hr className={styles.divider} />
            <div className={styles.sectionLabel}>スケジュール</div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>作業日</label>
                <input
                  className={styles.input}
                  type="date"
                  {...register("planDate")}
                />
                <ErrorMsg message={errors.planDate?.message} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>出発時刻</label>
                <input
                  className={styles.input}
                  type="time"
                  {...register("departTime")}
                />
                <ErrorMsg message={errors.departTime?.message} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>終了時刻</label>
                <input
                  className={styles.input}
                  type="time"
                  {...register("endTime")}
                />
                <ErrorMsg message={errors.endTime?.message} />
              </div>
            </div>
            {ganttVisible && (
              <div className={styles.ganttPreview}>
                <p className={styles.ganttPreviewLabel}>
                  ガントチャートプレビュー
                </p>
                <div className={styles.ganttTrack}>
                  <span className={styles.ganttTime}>{departTime}</span>
                  <div className={styles.ganttBarWrap}>
                    <div className={styles.ganttBar}>{ganttText}</div>
                  </div>
                  <span className={styles.ganttTimeRight}>{endTime}</span>
                </div>
              </div>
            )}

            <hr className={styles.divider} />
            <div className={styles.sectionLabel}>担当</div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>ドライバー</label>
                <select
                  className={styles.input}
                  {...register("driverId")}
                  onChange={handleDriverChange}
                >
                  <option value="">選択してください</option>
                  {DRIVERS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ErrorMsg message={errors.driverId?.message} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>車番</label>
                <select className={styles.input} {...register("vehicleId")}>
                  <option value="">選択してください</option>
                  {VEHICLES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate}
                    </option>
                  ))}
                </select>
                <ErrorMsg message={errors.vehicleId?.message} />
              </div>
            </div>

            <hr className={styles.divider} />
            <div className={styles.sectionLabel}>到着時間</div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>配達共通の到着時刻</label>
                <input
                  className={`${styles.input} ${individualTime ? styles.inputDisabled : ""}`}
                  type="time"
                  disabled={individualTime}
                  {...register("unifiedArrival")}
                />
              </div>
            </div>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="individual-time-check"
                className={styles.checkbox}
                {...register("individualTime")}
              />
              <label
                htmlFor="individual-time-check"
                className={styles.labelClickable}
              >
                配達ごとに個別設定する
              </label>
            </div>
          </div>

          <div className={styles.sectionLabel}>配達</div>
          {fields.map((field, i) => (
            <DeliveryCard
              key={field.id}
              deliveryIndex={i}
              control={control}
              register={register}
              setValue={setValue}
              errors={errors}
              onRemove={() => remove(i)}
              showIndividualTime={individualTime}
            />
          ))}
          <button
            className={styles.addBtn}
            onClick={() => append(defaultDelivery())}
            type="button"
          >
            ＋ 配達を追加
          </button>
          <ErrorMsg message={errors.deliveries?.message} />

          <div className={styles.routeSection}>
            <div className={styles.sectionLabel}>走行ルート</div>
            <RoutePreview deliveries={deliveries} />
            <p className={styles.routeHint}>ドラッグして順番を変更できます</p>
          </div>

          {mode === "edit" && onDelete ? (
            <div className={styles.footerWithDelete}>
              <button
                className={styles.btnDelete}
                type="button"
                onClick={onDelete}
              >
                削除
              </button>
              <div className={styles.footerRight}>
                <button
                  className={styles.btnCancel}
                  type="button"
                  onClick={onClose}
                >
                  キャンセル
                </button>
                <button className={styles.btnSubmit} type="submit">
                  更新する
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.footer}>
              <button
                className={styles.btnCancel}
                type="button"
                onClick={onClose}
              >
                キャンセル
              </button>
              <button className={styles.btnSubmit} type="submit">
                登録する
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
