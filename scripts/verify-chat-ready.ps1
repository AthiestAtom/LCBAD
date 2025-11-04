Write-Host "=== Verifying Anonymous Chat Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check key files
$files = @(
    @{ Name = "MTProto Client"; Path = "src\integrations\web3\mtproto-client.ts" },
    @{ Name = "Enhanced Hook"; Path = "src\hooks\useAnonymousChat.tsx" },
    @{ Name = "Chat Component"; Path = "src\pages\AnonymousChat.tsx" },
    @{ Name = "Supabase Client"; Path = "src\integrations\supabase\client.ts" },
    @{ Name = "Web3 Client"; Path = "src\integrations\web3\client.ts" }
)

$allGood = $true
foreach ($file in $files) {
    if (Test-Path $file.Path) {
        Write-Host "âœ… $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "âŒ $($file.Name) - MISSING!" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""
Write-Host "=== Checking Component Integration ===" -ForegroundColor Cyan
$hookCheck = Select-String -Path "src\pages\AnonymousChat.tsx" -Pattern "useAnonymousChat" -Quiet
if ($hookCheck) {
    Write-Host "âœ… Component uses the hook correctly" -ForegroundColor Green
} else {
    Write-Host "âŒ Component not using the hook!" -ForegroundColor Red
    $allGood = $false
}

$mtProtoCheck = Select-String -Path "src\hooks\useAnonymousChat.tsx" -Pattern "mtproto-client" -Quiet
if ($mtProtoCheck) {
    Write-Host "âœ… Hook has MTProto integration" -ForegroundColor Green
} else {
    Write-Host "âŒ Hook missing MTProto integration!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""
if ($allGood) {
    Write-Host "âœ… All core components are in place!" -ForegroundColor Green
    Write-Host ""
    Write-Host "âš ï¸  FINAL CHECKLIST:" -ForegroundColor Yellow
    Write-Host "  1. Environment variables set (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)"
    Write-Host "  2. Migration ran successfully (you confirmed this âœ…)"
    Write-Host "  3. Dev server running (npm run dev)"
    Write-Host "  4. Navigate to Anonymous Chat page in your app"
} else {
    Write-Host "âŒ Some components are missing!" -ForegroundColor Red
}
