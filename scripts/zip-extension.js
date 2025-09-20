import fs from "fs"
import path from "path"
import archiver from "archiver"
import chalk from "chalk"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Parse command line arguments
const args = process.argv.slice(2)
const isDev = args.includes("--dev")

/**
 * Creates a ZIP file of the extension for Chrome Web Store submission
 */
async function zipExtension() {
  const distPath = path.resolve(__dirname, "../dist")
  const manifestPath = path.join(distPath, "manifest.json")

  // Check if dist folder exists
  if (!fs.existsSync(distPath)) {
    console.error(chalk.red('❌ dist folder not found. Run "npm run build" first.'))
    process.exit(1)
  }

  // Read manifest to get version and name
  let version = "unknown"
  let name = "unknown"
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    version = manifest.version
    name = manifest.name.toLowerCase().replace(/\s+/g, "-")
  } catch (error) {
    console.warn(chalk.yellow("⚠️  Could not read version or name from manifest.json"))
  }

  const suffix = isDev ? "-dev" : ""
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
  const zipFileName = `${name}-v${version}${suffix}-${timestamp}.zip`
  const zipPath = path.resolve(__dirname, "../releases", zipFileName)

  // Ensure releases directory exists
  const releasesDir = path.dirname(zipPath)
  if (!fs.existsSync(releasesDir)) {
    fs.mkdirSync(releasesDir, { recursive: true })
  }

  console.log(chalk.blue("📦 Creating extension package..."))
  console.log(chalk.gray(`   Source: ${distPath}`))
  console.log(chalk.gray(`   Output: ${zipFileName}`))

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath)
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    })

    output.on("close", () => {
      const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2)
      console.log(chalk.green("✅ Extension packaged successfully!"))
      console.log(chalk.gray(`   File: ${zipFileName}`))
      console.log(chalk.gray(`   Size: ${sizeInMB} MB`))
      console.log(chalk.gray(`   Files: ${archive.pointer()} bytes`))

      if (!isDev) {
        console.log(chalk.yellow("\n📋 Next steps:"))
        console.log(chalk.gray("   1. Test the extension locally"))
        console.log(chalk.gray("   2. Upload to Chrome Web Store Developer Dashboard"))
        console.log(chalk.gray("   3. Fill out store listing details"))
        console.log(chalk.gray("   4. Submit for review"))
      }

      // Check size limit (Chrome Web Store has a 128MB limit)
      if (archive.pointer() > 128 * 1024 * 1024) {
        console.warn(chalk.yellow("⚠️  Warning: Package size exceeds 128MB Chrome Web Store limit"))
      }

      resolve(zipPath)
    })

    archive.on("error", reject)

    archive.pipe(output)

    // Add all files from dist directory
    archive.directory(distPath, false)

    // Exclude development files if they exist
    const excludePatterns = ["**/*.map", "**/bundle-report.html", "**/*.gz"]

    console.log(chalk.gray("   Excluding development files..."))

    archive.finalize()
  })
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  zipExtension().catch((error) => {
    console.error(chalk.red("❌ Failed to create package:"), error.message)
    process.exit(1)
  })
}

