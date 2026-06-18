// Dữ liệu DEMO dễ thương — xem ghi chú ở demo-yarns.ts.
import type { CraftType, Difficulty, PatternCategory, WeightCategory } from "../../lib/generated/prisma/client";
import type { PatternSeedData } from "./patterns";

export const demoPatternSeedData: PatternSeedData[] = [
  {
    title: "Mũ Len Tai Gấu Cho Bé",
    craftType: "crochet" as CraftType,
    difficulty: "beginner" as Difficulty,
    category: "baby" as PatternCategory,
    yarnWeight: "sport" as WeightCategory,
    hookNeedleSize: "Móc 3.5mm",
    gauge: "16 mũi x 16 hàng = 10cm x 10cm",
    finishedSize: "Vòng đầu 40-46cm (0-12 tháng)",
    yarnAmount: "80g sợi cotton",
    timeEstimate: "3-4 giờ",
    description:
      "Chiếc mũ tròn êm ái với hai tai gấu nhỏ đáng yêu phía trên, móc từ sợi cotton mềm mịn an toàn cho da bé. Mẫu rất dễ làm, phù hợp để bắt đầu món quà handmade đầu tiên tặng bé yêu.",
    tags: ["cho bé", "người mới", "quà tặng"],
    isOriginal: true,
    suitableYarnNames: ["Len Cotton Baby Mây"],
    steps: [
      {
        order: 1,
        title: "Móc đáy mũ",
        content:
          "Bắt đầu bằng 6 mũi đơn vào vòng tròn ma thuật (magic ring). Tăng dần đều mỗi hàng theo vòng tròn cho đến khi đạt khoảng 48-54 mũi, tùy size đầu bé.",
        tip: "Đếm mũi sau mỗi hàng để tránh bị lệch tăng giảm không đều.",
      },
      {
        order: 2,
        title: "Móc thân mũ",
        content:
          "Móc thẳng (không tăng giảm) các hàng mũi đơn cho đến khi thân mũ đạt chiều cao mong muốn, đo từ đỉnh đầu xuống ngang tai bé.",
      },
      {
        order: 3,
        title: "Móc 2 tai gấu",
        content:
          "Móc 2 hình tròn nhỏ đường kính khoảng 4cm, nhồi nhẹ một ít bông gòn rồi khâu cố định lên hai bên đỉnh mũ.",
        tip: "Có thể thêm một lớp len màu hồng nhạt nhỏ hơn ở giữa tai để tạo điểm nhấn như tai gấu thật.",
      },
    ],
  },
  {
    title: "Khăn Choàng Caro Ấm Áp",
    craftType: "knitting" as CraftType,
    difficulty: "intermediate" as Difficulty,
    category: "accessories" as PatternCategory,
    yarnWeight: "dk" as WeightCategory,
    hookNeedleSize: "Kim 4.5mm",
    gauge: "18 mũi x 24 hàng = 10cm x 10cm",
    finishedSize: "180cm x 35cm",
    yarnAmount: "350g (2 màu sợi Merino)",
    timeEstimate: "10-12 giờ",
    description:
      "Họa tiết caro cổ điển phối hai màu sợi Merino mềm ấm, đan theo kỹ thuật đan màu kéo sợi phía sau (stranded knitting). Thành phẩm là chiếc khăn choàng vừa ấm vừa sang, hợp diện cả mùa thu và đông.",
    tags: ["mùa đông", "phối màu", "quà tặng"],
    isOriginal: true,
    suitableYarnNames: ["Len Merino Sữa Non"],
    steps: [
      {
        order: 1,
        title: "Lên mũi và đan viền",
        content: "Lên 64 mũi, đan 6 hàng gân (rib 2x2) để tạo viền chắc chắn không bị cong mép.",
      },
      {
        order: 2,
        title: "Đan họa tiết caro",
        content:
          "Đan xen 2 màu sợi theo biểu đồ caro 8 mũi x 8 hàng, lặp lại đều suốt chiều dài khăn. Luôn kéo sợi màu chưa dùng nhẹ tay phía sau để không bị dúm mặt vải.",
        tip: "Giữ độ căng sợi đều tay — nếu kéo quá chặt, khăn sẽ bị nhăn dúm khi hoàn thành.",
      },
      {
        order: 3,
        title: "Kết thúc và làm tua rua",
        content: "Đan 6 hàng gân kết thúc tương tự viền đầu, bắt mũi cuối, sau đó cắt sợi làm tua rua hai đầu khăn.",
      },
    ],
  },
  {
    title: "Túi Tote Móc Hoa Mini",
    craftType: "crochet" as CraftType,
    difficulty: "beginner" as Difficulty,
    category: "accessories" as PatternCategory,
    yarnWeight: "worsted" as WeightCategory,
    hookNeedleSize: "Móc 4mm",
    gauge: "14 mũi x 14 hàng = 10cm x 10cm",
    finishedSize: "28cm x 24cm",
    yarnAmount: "200g sợi acrylic nhiều màu",
    timeEstimate: "5-6 giờ",
    description:
      "Chiếc túi tote nhỏ xinh với một bông hoa móc rời gắn ở mặt trước, dùng được để đựng đồ lặt vặt hoặc làm túi đi chơi cuối tuần. Mẫu cơ bản, rất hợp để luyện tay mới làm quen với móc len.",
    tags: ["người mới", "túi xách", "giá tốt"],
    isOriginal: true,
    suitableYarnNames: ["Sợi Acrylic Cầu Vồng"],
    steps: [
      {
        order: 1,
        title: "Móc đáy túi",
        content: "Móc một hình chữ nhật mũi đơn kích thước 28cm x 10cm làm đáy túi.",
      },
      {
        order: 2,
        title: "Móc thân túi",
        content:
          "Từ đáy, móc thẳng lên các hàng mũi đơn vòng quanh cho đến khi đạt chiều cao 24cm, không tăng giảm mũi.",
      },
      {
        order: 3,
        title: "Móc quai túi và hoa trang trí",
        content:
          "Móc 2 dải dây dài 40cm làm quai, đính vào hai bên miệng túi. Móc thêm một bông hoa 5 cánh nhỏ rồi khâu cố định lên mặt trước túi.",
        tip: "Có thể dùng 2-3 màu sợi khác nhau cho bông hoa để túi thêm nổi bật.",
      },
    ],
  },
  {
    title: "Gấu Bông Amigurumi Mini",
    craftType: "crochet" as CraftType,
    difficulty: "beginner" as Difficulty,
    category: "amigurumi" as PatternCategory,
    yarnWeight: "worsted" as WeightCategory,
    hookNeedleSize: "Móc 3mm",
    gauge: "Móc chặt tay để giấu bông nhồi bên trong",
    finishedSize: "Cao khoảng 15cm",
    yarnAmount: "60g sợi acrylic + bông nhồi",
    timeEstimate: "4-5 giờ",
    description:
      "Một chú gấu bông amigurumi tròn trịa, đáng yêu, móc từ sợi acrylic bền màu. Đây là mẫu khởi đầu lý tưởng cho ai mới làm quen với amigurumi — ít chi tiết nhưng vẫn cực kỳ dễ thương.",
    tags: ["amigurumi", "người mới", "quà tặng"],
    isOriginal: true,
    suitableYarnNames: ["Sợi Acrylic Cầu Vồng", "Len Mohair Bông Mây"],
    steps: [
      {
        order: 1,
        title: "Móc đầu gấu",
        content:
          "Móc một hình cầu từ vòng tròn ma thuật, tăng dần đến 30 mũi rồi giảm dần để khép lại thành hình tròn, nhồi bông trước khi khép kín hoàn toàn.",
      },
      {
        order: 2,
        title: "Móc thân và tay chân",
        content:
          "Móc thân gấu theo cách tương tự đầu nhưng nhỏ hơn, và móc 4 chi nhỏ hình trụ ngắn. Nhồi bông vừa đủ, không nhồi quá chặt để giữ độ mềm tự nhiên.",
        tip: "Nhồi bông từng chút một và nắn đều tay để gấu không bị méo hình.",
      },
      {
        order: 3,
        title: "Ghép nối và thêm chi tiết mặt",
        content:
          "Khâu ghép đầu, thân, tay chân lại với nhau. Thêm mắt (cúc nhỏ hoặc mắt nhựa an toàn) và thêu mũi, miệng bằng sợi màu tối.",
        tip: "Nếu làm tặng bé dưới 3 tuổi, nên thêu mắt bằng chỉ thay vì dùng mắt nhựa rời để đảm bảo an toàn.",
      },
    ],
  },
];
