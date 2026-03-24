"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
async function main() {
    await prisma_1.prisma.phone.deleteMany();
    await prisma_1.prisma.laptop.deleteMany();
    await prisma_1.prisma.phone.createMany({
        data: [
            {
                brand: 'Samsung',
                model: 'Galaxy A55',
                soc: 'Exynos 1480',
                ramGb: 8,
                storageGb: 256,
                batteryMah: 5000,
                benchmark: 620000,
                priceIdr: 6000000,
            },
            {
                brand: 'Xiaomi',
                model: 'Redmi Note 13 Pro',
                soc: 'Snapdragon 7s Gen 2',
                ramGb: 8,
                storageGb: 256,
                batteryMah: 5100,
                benchmark: 650000,
                priceIdr: 5000000,
            },
        ],
    });
    await prisma_1.prisma.laptop.createMany({
        data: [
            {
                brand: 'Lenovo',
                model: 'LOQ 15',
                cpu: 'i5-13420H',
                gpu: 'RTX 4050',
                ramGb: 16,
                storageGb: 512,
                benchmark: 17000,
                priceIdr: 14000000,
            },
            {
                brand: 'Acer',
                model: 'Nitro V',
                cpu: 'i5-12500H',
                gpu: 'RTX 4060',
                ramGb: 16,
                storageGb: 512,
                benchmark: 19000,
                priceIdr: 15000000,
            },
        ],
    });
}
main()
    .then(() => {
    console.log('Seed done');
})
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
