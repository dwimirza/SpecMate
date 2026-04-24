export type CategoryId = 'phone' | 'laptop' | 'pc' | 'db_cpu';
export type SubCategoryId = 'gpu' | 'cpu' | null;

export interface SpecDef {
    id: string;
    label: string;
    desc: string;
    weight: number; // For overall scoring calculation
}

export interface CategoryDef {
    id: CategoryId;
    name: string;
    specs: SpecDef[];
}

export const CATEGORIES: Record<string, CategoryDef> = {
    phone: {
        id: 'phone',
        name: 'Phones',
        specs: [
            { id: 'perf', label: 'Speed & Smoothness', desc: 'How fast apps open and games run without stuttering.', weight: 1.2 },
            { id: 'cam', label: 'Camera Quality', desc: 'Detail, low-light performance, and video quality.', weight: 1.5 },
            { id: 'batt', label: 'Battery Life', desc: 'How long it lasts on a single charge with normal use.', weight: 1.0 },
            { id: 'disp', label: 'Screen Quality', desc: 'Brightness, colors, and how good it looks outdoors.', weight: 0.8 },
            { id: 'build', label: 'Build & Durability', desc: 'Materials used and drop/water resistance.', weight: 0.5 }
        ]
    },
    laptop: {
        id: 'laptop',
        name: 'Laptops',
        specs: [
            { id: 'processing', label: 'Processing & Graphics', desc: 'Combined estimate based on CPU and GPU tiers combined.', weight: 1.5 },
            { id: 'memory', label: 'Memory Range (RAM/SSD)', desc: 'Multitasking stability (RAM) and max file storage capabilities (StorageGb).', weight: 1.2 },
            { id: 'disp', label: 'Display Technology', desc: 'Screen size, resolution density, and refresh rates.', weight: 1.0 },
            { id: 'batt', label: 'Battery Capacity', desc: 'Raw battery size in Watt-Hours or estimated hours of screen time.', weight: 1.0 }
        ]
    },
    pc_cpu: {
        id: 'pc',
        name: 'PC CPUs',
        specs: [
            { id: 'gaming', label: 'Gaming Performance', desc: 'How many frames per second (FPS) it can help push in modern games.', weight: 1.5 },
            { id: 'prod', label: 'Productivity & Multi-tasking', desc: 'Speed for video editing, rendering, and heavy multitasking.', weight: 1.2 },
            { id: 'eff', label: 'Power Efficiency', desc: 'How little electricity it uses while staying cool.', weight: 0.8 },
            { id: 'platform', label: 'Upgradeability', desc: 'How long you can keep the motherboard for future upgrades.', weight: 1.0 }
        ]
    },
    pc_gpu: {
        id: 'pc',
        name: 'PC GPUs',
        specs: [
            { id: '1440p', label: '1440p High-Res Gaming', desc: 'Performance at crisp 1440p resolution (Sweet spot for most).', weight: 1.5 },
            { id: '4k', label: '4K Ultra-Res Gaming', desc: 'Ability to drive incredibly detailed 4K monitors.', weight: 1.2 },
            { id: 'rt', label: 'Ray Tracing & Tech', desc: 'Handling realistic lighting, reflections, and upscaling tech.', weight: 1.0 },
            { id: 'vram', label: 'Future-Proofing (Memory)', desc: 'How well it will handle textures in games 3 years from now.', weight: 0.8 }
        ]
    },
    db_cpu: {
        id: 'db_cpu',
        name: 'Raw DB Processors',
        specs: [
            { id: 'singleCore', label: 'Everyday Speed (Single-Core)', desc: 'Based strictly on the singleCore database column. Dictates daily snappiness and gaming feel.', weight: 1.5 },
            { id: 'multiCore', label: 'Heavy Work (Multi-Core)', desc: 'Based strictly on the overall benchmark column. Dictates professional workload speed.', weight: 1.5 }
        ]
    }
};

// CSV Content from data/laptops.csv (Synchronized as a string for web runtime)
export const CSV_CONTENT = `HP Pavilion 14-dv2041TU Laptop (12th Gen Core i5/ 16GB/ 512GB SSD/ Win 11),HP,59480.0,4.45,60.0,Windows 11 OS,12th Gen Intel Core i5 1235U,16 GB DDR4 RAM,512 GB SSD,Intel Iris Xe Graphics,14 inches,1920 x 1080 pixels,"10 Cores (2P + 8E), 12 Threads",1 Year Warranty,https://cdn1.smartprix.com/rx-i72YrVvxw-w280-h280/hp-pavilion-14-dv204.webp
HP Pavilion 14-dv2015TU Laptop (12th Gen Core i7/ 16GB/ 1TB SSD/ Win 11),HP,78850.0,4.6,63.0,Windows 11 OS,12th Gen Intel Core i7 1255U,16 GB DDR4 RAM,1 TB SSD,Intel Iris Xe Graphics,14 inches,1920 x 1080 pixels,"10 Cores (2P + 8E), 12 Threads",1 Year Warranty,https://cdn1.smartprix.com/rx-i1CuEUDbf-w280-h280/hp-pavilion-14-dv201.webp
Asus TUF Gaming F15 FX506LHB-HN355WS Gaming Laptop (10th Gen Core i5/ 8GB/ 512GB SSD/ Win11 Home/ 4GB Graph),Asus,59500.0,4.3,57.0,Windows 11 OS,10th Gen Intel Core i5 10300H,8 GB DDR4 RAM,512 GB SSD,4 GB NVIDIA GeForce GTX 1650,15.6 inches,1920 x 1080 pixels,"Quad Core, 8 Threads",1 Year Warranty,https://cdn1.smartprix.com/rx-iDERVFBsC-w280-h280/asus-tuf-gaming-f15.webp`;

export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    priceStr: string;
    categoryId: CategoryId;
    subCategoryId?: SubCategoryId;
    bottomLine: string;
    imageUrl?: string;
    specValues: Record<string, { value: string; detail: string; score: number }>;
}

// Simple CSV parser for the web
function parseCSV(content: string) {
    const rows = content.split('\n').filter(line => line.trim());
    return rows.map((line, index) => {
        // Regex to handle quoted commas correctly
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        // Fallback if regex fails on simple structure
        const cells = matches ? matches.map(m => m.replace(/^"|"$/g, '')) : line.split(',');

        return {
            id: index + 1,
            modelName: cells[0],
            brand: cells[1],
            price: parseFloat(cells[2]),
            rating: parseFloat(cells[3]),
            score: parseFloat(cells[4]),
            os: cells[5],
            cpu: cells[6],
            ram: cells[7],
            storage: cells[8],
            gpu: cells[9],
            screenSize: cells[10],
            resolution: cells[11],
            coresThreads: cells[12],
            warranty: cells[13],
            imageUrl: cells[14]
        };
    });
}

function convertCSVToProducts(csvText: string): Product[] {
    const rawRows = parseCSV(csvText);
    return rawRows.map(row => {
        const rpFormatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        });
        const priceStr = rpFormatter.format(row.price);

        // Score parsing/extraction
        const ramGb = parseInt(row.ram.match(/\d+/)?.[0] || '8');
        const storageGb = parseInt(row.storage.match(/\d+/)?.[0] || '512');

        // Memory Score
        const ramScore = Math.min((ramGb / 32) * 50, 50);
        const storageScore = Math.min((storageGb / 2048) * 50, 50);
        const memoryScore = Math.round(ramScore + storageScore) + 20;

        // Display Score
        const resMatch = row.resolution.match(/(\d+)\s*x\s*(\d+)/);
        const resX = resMatch ? parseInt(resMatch[1]) : 1920;
        const resY = resMatch ? parseInt(resMatch[2]) : 1080;

        let dispScore = 60;
        if (resX > 1920) dispScore += 20;
        if (row.modelName.toLowerCase().includes('hz')) dispScore += 15; // Rough check

        // Battery Score (CSV doesn't have explicit size, we'll use a heuristic or the provided 'score')
        // We'll use the 'score' column as a base for battery/overall quality if needed, 
        // but the system expects a 'batt' spec.
        const battScore = Math.round(row.score * 0.8) + 10;

        // Processing Score
        let cpuScore = 60;
        const cpuLower = row.cpu.toLowerCase();
        if (cpuLower.includes('i9') || cpuLower.includes('ryzen 9')) cpuScore = 95;
        else if (cpuLower.includes('i7') || cpuLower.includes('ryzen 7')) cpuScore = 85;
        else if (cpuLower.includes('i5') || cpuLower.includes('ryzen 5')) cpuScore = 70;

        let gpuScore = 40;
        const gpuLower = row.gpu.toLowerCase();
        if (gpuLower.includes('rtx')) gpuScore = 80;
        if (gpuLower.includes('gtx')) gpuScore = 60;
        if (gpuLower.includes('iris') || gpuLower.includes('integrated')) gpuScore = 40;

        const procScore = Math.round((cpuScore * 0.6) + (gpuScore * 0.4));

        return {
            id: `l_${row.id}`,
            name: row.modelName.split(' Laptop')[0],
            brand: row.brand,
            price: row.price,
            priceStr: priceStr,
            categoryId: 'laptop',
            imageUrl: row.imageUrl,
            bottomLine: `${row.warranty}. Operating System: ${row.os}.`,
            specValues: {
                processing: {
                    value: procScore > 80 ? 'High-End Power' : procScore > 65 ? 'Mid-Range Solid' : 'Entry-Level Basic',
                    detail: `${row.cpu} with ${row.gpu}`,
                    score: procScore
                },
                memory: {
                    value: `${ramGb}GB / ${storageGb}GB`,
                    detail: `${row.ram} + ${row.storage}`,
                    score: memoryScore
                },
                disp: {
                    value: `${resX}x${resY}`,
                    detail: `${row.screenSize} Display at ${row.resolution}`,
                    score: dispScore
                },
                batt: {
                    value: 'Standard',
                    detail: `Optimized for ${row.os}`,
                    score: battScore
                }
            }
        };
    });
}

export const PRODUCTS: Product[] = [
    ...convertCSVToProducts(CSV_CONTENT)
];

