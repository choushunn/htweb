import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const IMG = {
  // Banners
  banner1: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chemical%20catalyst%20research%20laboratory%2C%20glass%20reactors%20and%20catalyst%20samples%2C%20modern%20chemical%20plant%20background%2C%20professional%20industrial%20atmosphere&image_size=landscape_16_9",
  banner2: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Hydrogenation%20catalyst%20production%20facility%2C%20industrial%20chemical%20reactors%2C%20advanced%20manufacturing%20plant%2C%20clean%20and%20modern%20industrial%20environment&image_size=landscape_16_9",
  banner3: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=International%20chemical%20industry%20trade%20fair%20exhibition%20booth%2C%20catalyst%20products%20display%2C%20global%20business%20networking&image_size=landscape_16_9",

  // News
  news1: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chemical%20industry%20conference%20exhibition%20hall%2C%20catalyst%20technology%20forum%2C%20industry%20experts%20presenting%2C%20professional%20conference%20atmosphere&image_size=landscape_4_3",
  news2: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20catalyst%20research%20and%20development%20laboratory%2C%20scientists%20analyzing%20samples%2C%20advanced%20analytical%20instruments%2C%20clean%20lab%20environment&image_size=landscape_4_3",
  news3: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=International%20trade%20agreement%20signing%20ceremony%2C%20global%20business%20partners%20shaking%20hands%2C%20export%20contract%20documents%2C%20professional%20corporate%20event&image_size=landscape_4_3",

  // Products
  product1: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Raney%20nickel%20catalyst%20powder%20in%20glass%20container%2C%20fine%20gray%20metal%20powder%2C%20chemical%20catalyst%20material%2C%20laboratory%20sample%20photography%2C%20white%20background&image_size=square_hd",
  product2: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Ni-Al%20alloy%20powder%20catalyst%20in%20laboratory%20container%2C%20silver-gray%20metal%20powder%2C%20chemical%20industry%20raw%20material%2C%20close-up%20product%20shot&image_size=square_hd",
  product3: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Palladium%20on%20carbon%20catalyst%20Pd%20C%20black%20powder%20in%20glass%20vial%2C%20precious%20metal%20catalyst%2C%20fine%20chemical%20product%20photography&image_size=square_hd",
  product4: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cobalt%20catalyst%20powder%20in%20a%20glass%20jar%2C%20dark%20gray%20fine%20powder%2C%20industrial%20chemical%20catalyst%2C%20laboratory%20product%20display&image_size=square_hd",
  product5: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Copper%20catalyst%20granules%20in%20glass%20container%2C%20reddish-brown%20metal%20particles%2C%20industrial%20hydrogenation%20catalyst%2C%20product%20photography&image_size=square_hd",
  product6: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Amorphous%20nickel%20alloy%20catalyst%20powder%20in%20laboratory%20container%2C%20advanced%20catalyst%20material%2C%20fine%20gray%20powder%2C%20chemical%20industry&image_size=square_hd",

  // Certificates
  cert1: "/certificates/iso9001.jpg",
  cert2: "/certificates/iso14001.jpg",
  cert3: "/certificates/ohsas.jpg",
  cert4: "/certificates/license.jpg",
  cert5: "/certificates/dangerous-chemicals.jpg",
};

async function main() {
  await prisma.$transaction(async (tx) => {
    // 0. 清空旧数据（按外键顺序删除）
    await tx.product.deleteMany();
    await tx.category.deleteMany();
    await tx.news.deleteMany();
    await tx.certificate.deleteMany();
    await tx.banner.deleteMany();
    await tx.siteSetting.deleteMany();

    // 1. 创建默认管理员
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    await tx.admin.upsert({
      where: { username: "admin" },
      update: {},
      create: { username: "admin", password: hashedPassword },
    });

    // 2. 新闻
    await tx.news.createMany({
      data: [
        {
          title: "山东昊天催化科技亮相2024中国国际催化剂展览会",
          summary: "公司携全线催化剂产品参展，达成多项合作意向。",
          content: `<p>2024年12月，山东昊天催化科技有限公司亮相中国国际催化剂与催化技术展览会，展示了包括铝镍合金氢化催化剂、镍铝合金粉、贵金属催化剂在内的全线产品。</p><p>展会期间，公司展位吸引了大量国内外客户参观咨询，现场达成合作意向逾千万元。</p><blockquote><p>"我们将持续优化产品品质和服务体验，为客户提供更优质的催化解决方案。"——公司总经理</p></blockquote>`,
          coverImage: IMG.news1,
          isPublished: true,
        },
        {
          title: "公司引进新型催化剂生产线，产能提升40%",
          summary: "投资2000万元引进的全自动催化剂生产线正式投产。",
          content: `<p>公司近期完成了新型催化剂生产线的安装调试工作，该生产线引进自德国，总投资额达2000万元人民币。</p><p>新产线投产后，铝镍合金氢化催化剂系列产品的产能将提升40%，产品品质达到国际先进水平，可满足全球客户对高品质加氢催化剂的需求。</p><ul><li>产品粒度精度提升至±1μm</li><li>年产能增加2000吨</li><li>能耗降低25%</li></ul>`,
          coverImage: IMG.news2,
          isPublished: true,
        },
        {
          title: "山东昊天催化科技与东南亚客户签订长期供货协议",
          summary: "公司开拓海外市场取得新突破，年出口额预计增长50%。",
          content: `<p>山东昊天催化科技有限公司近日与多家东南亚客户签订了长期战略供货协议，合同总金额超过5000万元。</p><p>协议涵盖铝镍合金氢化催化剂、镍铝合金粉、贵金属催化剂等核心产品，标志着公司在海外市场拓展方面取得了重要突破。</p>`,
          coverImage: IMG.news3,
          isPublished: true,
        },
      ],
    });

    // 3. 分类和产品
    const cat1 = await tx.category.create({ data: { name: "加氢催化剂", sort: 1 } });
    const cat2 = await tx.category.create({ data: { name: "镍铝合金粉", sort: 2 } });
    const cat3 = await tx.category.create({ data: { name: "铝镍合金氢化催化剂", sort: 3 } });
    const cat4 = await tx.category.create({ data: { name: "铝镍合金氢化催化剂（R-Ni型）", sort: 4 } });
    const cat5 = await tx.category.create({ data: { name: "非晶态铝镍合金氢化催化剂", sort: 5 } });
    const cat6 = await tx.category.create({ data: { name: "贵金属催化剂", sort: 6 } });
    const cat7 = await tx.category.create({ data: { name: "雷尼钴催化剂", sort: 7 } });
    const cat8 = await tx.category.create({ data: { name: "雷尼铜催化剂", sort: 8 } });
    const cat9 = await tx.category.create({ data: { name: "雷尼铁催化剂", sort: 9 } });

    await tx.product.createMany({
      data: [
        // 加氢催化剂
        {
          name: "通用型加氢催化剂",
          categoryId: cat1.id,
          description: "适用于各类有机化合物加氢反应，活性高、选择性好",
          detail: `<p>加氢催化剂是公司核心产品之一，适用于烯烃、芳烃、醛酮、硝基化合物等多种有机物的加氢反应。</p><p><strong>产品特点：</strong></p><ul><li>高催化活性，反应速率快</li><li>优良的选择性，副反应少</li><li>稳定性好，使用寿命长</li><li>可针对不同工艺定制</li></ul>`,
          images: [IMG.product1],
          sort: 1,
          isPublished: true,
        },
        {
          name: "定制加氢催化剂",
          categoryId: cat1.id,
          description: "根据客户工艺条件定制开发的专用加氢催化剂",
          detail: `<p>提供从实验室小试到工业放大的全程定制服务，根据客户原料特性、工艺条件和目标产物设计专属催化剂方案。</p>`,
          images: [IMG.product1],
          sort: 2,
          isPublished: true,
        },
        // 镍铝合金粉
        {
          name: "镍铝合金粉（活化型）",
          categoryId: cat2.id,
          description: "高活性镍铝合金粉，碱活化后制备铝镍合金氢化催化剂",
          detail: `<p>镍铝合金粉是制备铝镍合金氢化催化剂的关键原料，公司采用先进熔炼工艺生产，成分均匀、活性高。</p><p><strong>技术指标：</strong></p><ul><li>Ni含量：40%-50%</li><li>Al含量：50%-60%</li><li>粒度：50-500μm（可调）</li><li>活化后活性≥行业标准</li></ul>`,
          images: [IMG.product2],
          sort: 1,
          isPublished: true,
        },
        {
          name: "镍铝合金粉（特细型）",
          categoryId: cat2.id,
          description: "超细镍铝合金粉，适用于特殊催化工艺",
          detail: `<p>特细型镍铝合金粉，粒度可控制在20-50μm，适用于对催化剂粒度有特殊要求的应用场景。</p>`,
          images: [IMG.product2],
          sort: 2,
          isPublished: true,
        },
        // 铝镍合金氢化催化剂
        {
          name: "铝镍合金氢化催化剂",
          categoryId: cat3.id,
          description: "铝镍合金骨架催化剂，高效加氢性能",
          detail: `<p>铝镍合金氢化催化剂是经碱液抽铝处理后形成的多孔骨架催化剂，具有优异的加氢催化性能。</p><p><strong>产品特点：</strong></p><ul><li>多孔骨架结构，比表面积大</li><li>加氢活性高，低温低压性能优异</li><li>批次稳定性好</li></ul>`,
          images: [IMG.product2],
          sort: 1,
          isPublished: true,
        },
        // 铝镍合金氢化催化剂（R-Ni型）
        {
          name: "R-Ni 型铝镍合金氢化催化剂",
          categoryId: cat4.id,
          description: "标准型铝镍合金氢化催化剂，广泛用于有机合成加氢",
          detail: `<p>R-Ni型铝镍合金氢化催化剂是公司主力产品，采用优质镍铝合金粉经活化工艺制备，产品性能稳定。</p><p><strong>应用领域：</strong></p><ul><li>医药中间体加氢</li><li>精细化学品合成</li><li>油脂加氢</li><li>石油化工</li></ul><p><strong>包装：</strong>20kg/桶，50kg/桶（水封包装）</p>`,
          images: [IMG.product1],
          sort: 1,
          isPublished: true,
        },
        {
          name: "R-Ni 高活性铝镍合金氢化催化剂",
          categoryId: cat4.id,
          description: "高活性型铝镍合金氢化催化剂，反应条件更温和",
          detail: `<p>高活性型铝镍合金氢化催化剂经特殊活化处理，具有更高的催化活性，可在更温和的条件下完成加氢反应。</p>`,
          images: [IMG.product1],
          sort: 2,
          isPublished: true,
        },
        // 非晶态铝镍合金氢化催化剂
        {
          name: "非晶态铝镍合金氢化催化剂",
          categoryId: cat5.id,
          description: "非晶态结构铝镍合金催化剂，活性更高、抗中毒性更强",
          detail: `<p>非晶态铝镍合金氢化催化剂采用快速凝固工艺制备，具有独特的非晶态结构，相较于传统晶态催化剂具有更高的催化活性和抗中毒能力。</p><p><strong>产品优势：</strong></p><ul><li>非晶态结构，活性位点更多</li><li>抗硫、抗氯中毒性能优异</li><li>选择性更高</li><li>使用寿命长</li></ul>`,
          images: [IMG.product6],
          sort: 1,
          isPublished: true,
        },
        // 贵金属催化剂
        {
          name: "Pd/C 钯碳催化剂",
          categoryId: cat6.id,
          description: "载钯活性炭催化剂，高效加氢和脱苄反应",
          detail: `<p>贵金属催化剂以钯、钌、铑、铂等贵金属为活性组分，负载于活性炭、氧化铝等载体上。</p><p><strong>产品系列：</strong></p><ul><li>Pd/C（钯碳）：1%-10%负载量</li><li>Ru/C（钌碳）：1%-5%负载量</li><li>Rh/C（铑碳）：1%-5%负载量</li><li>Pt/C（铂碳）：1%-5%负载量</li></ul><p>广泛应用于医药、农药、精细化学品的加氢反应。</p>`,
          images: [IMG.product3],
          sort: 1,
          isPublished: true,
        },
        {
          name: "Ru/C 钌碳催化剂",
          categoryId: cat6.id,
          description: "负载型钌催化剂，适用于苯环加氢",
          detail: `<p>钌碳催化剂采用优质活性炭为载体，钌纳米颗粒均匀分散，对苯环加氢、葡萄糖加氢等反应具有优异活性。</p>`,
          images: [IMG.product3],
          sort: 2,
          isPublished: true,
        },
        // 雷尼钴催化剂
        {
          name: "R-Co 型雷尼钴催化剂",
          categoryId: cat7.id,
          description: "钴基骨架催化剂，用于特定选择性加氢反应",
          detail: `<p>雷尼钴催化剂以钴为活性组分，通过碱液抽铝制备多孔骨架结构，对某些特定加氢反应具有独特选择性。</p><p><strong>应用特点：</strong></p><ul><li>对腈类化合物加氢具有高选择性</li><li>适用于醛类加氢制备醇</li><li>磁性强，易于分离回收</li></ul>`,
          images: [IMG.product4],
          sort: 1,
          isPublished: true,
        },
        // 雷尼铜催化剂
        {
          name: "R-Cu 型雷尼铜催化剂",
          categoryId: cat8.id,
          description: "铜基骨架催化剂，适用于酯加氢和脱氢反应",
          detail: `<p>雷尼铜催化剂以铜为活性组分，适用于酯加氢制备醇、脱氢反应等工艺，具有优良的选择性。</p><p><strong>应用领域：</strong></p><ul><li>酯加氢制备高级醇</li><li>甲醇水蒸气重整制氢</li><li>有机化合物脱氢</li></ul>`,
          images: [IMG.product5],
          sort: 1,
          isPublished: true,
        },
        // 雷尼铁催化剂
        {
          name: "R-Fe 型雷尼铁催化剂",
          categoryId: cat9.id,
          description: "铁基骨架催化剂，用于合成氨和费托合成",
          detail: `<p>雷尼铁催化剂以铁为活性组分，具有独特的多孔骨架结构，适用于合成氨、费托合成等工业化反应。</p><p><strong>产品特点：</strong></p><ul><li>成本低廉，适合大规模工业应用</li><li>耐热性好，适用温度范围宽</li><li>机械强度高，耐磨损</li></ul>`,
          images: [IMG.product4],
          sort: 1,
          isPublished: true,
        },
      ],
    });

    // 4. 资质证书
    await tx.certificate.createMany({
      data: [
        { title: "ISO 9001 质量管理体系认证", imageUrl: IMG.cert1, sort: 1, isPublished: true },
        { title: "ISO 14001 环境管理体系认证", imageUrl: IMG.cert2, sort: 2, isPublished: true },
        { title: "ISO 45001 职业健康安全管理体系认证", imageUrl: IMG.cert3, sort: 3, isPublished: true },
        { title: "企业营业执照", imageUrl: IMG.cert4, sort: 4, isPublished: true },
        { title: "危险化学品经营许可证", imageUrl: IMG.cert5, sort: 5, isPublished: true },
      ],
    });

    // 5. 轮播图
    await tx.banner.createMany({
      data: [
        { title: "专业催化剂供应商", imageUrl: IMG.banner1, linkUrl: "/products", sort: 1, isActive: true },
        { title: "品质为本 科技创新", imageUrl: IMG.banner2, linkUrl: "/products", sort: 2, isActive: true },
        { title: "全球合作 服务世界", imageUrl: IMG.banner3, linkUrl: "/contact", sort: 3, isActive: true },
      ],
    });

    // 6. 站点设置
    await tx.siteSetting.createMany({
      data: [
        { key: "contact_phone", value: "13210894158" },
        { key: "contact_email", value: "1227134924@qq.com" },
        { key: "contact_address", value: "山东省临沂市沂河新区朝阳街道综合保税区东方跨境电商产业园20楼2010-2室" },
        { key: "copyright_text", value: "© 2022~2026 山东昊天金属科技有限公司 版权所有" },
        { key: "icp_number", value: "鲁ICP备202XXXXXXXX号-2" },
        { key: "wechat_qr", value: "/wechat.png" },
      ],
    });
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
