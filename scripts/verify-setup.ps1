# Final Verification Script
Write-Host "Checking Telegram-like Anonymous Chat Implementation..." -ForegroundColor Cyan
Write-Host ""

$checks = @(
    @{ Name = "MTProto Client"; Path = "src\integrations\web3\mtproto-client.ts" },
    @{ Name = "Enhanced Hook"; Path = "src\hooks\useAnonymousChat.tsx" },
    @{ Name = "Updated Component"; Path = "src\pages\AnonymousChat.tsx" },
    @{ Name = "Migration File"; Path = "supabase\migrations\20251104084124-telegram-like-messaging.sql" },
    @{ Name = "Supabase Types"; Path = "src\integrations\supabase\types.ts" },
    @{ Name = "Setup Guide"; Path = "ANONYMOUS_CHAT_SETUP.md" }
)

$allGood = $true
foreach ($check in $checks) {
    if (Test-Path $check.Path) {
        Write-Host "âœ… $($check.Name)" -ForegroundColor Green
    } else {
        Write-Host "âŒ $($check.Name) - Missing!" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""
if ($allGood) {
    Write-Host "All files are in place! âœ…" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Apply the migration via Supabase Dashboard (see ANONYMOUS_CHAT_SETUP.md)"
    Write-Host "2. Enable Realtime for the new tables"
    Write-Host "3. Start your dev server and test!"
} else {
    Write-Host "Some files are missing. Please check the paths." -ForegroundColor Red
}
