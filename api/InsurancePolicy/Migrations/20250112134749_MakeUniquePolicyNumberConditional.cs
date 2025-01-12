using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsurancePolicy.Migrations
{
    /// <inheritdoc />
    public partial class MakeUniquePolicyNumberConditional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_InsurancePolicies_PolicyNumber_CreatedById",
                table: "InsurancePolicies");

            migrationBuilder.CreateIndex(
                name: "IX_InsurancePolicies_PolicyNumber_CreatedById",
                table: "InsurancePolicies",
                columns: new[] { "PolicyNumber", "CreatedById" },
                unique: true,
                filter: "\"DeletedAtUtc\" IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_InsurancePolicies_PolicyNumber_CreatedById",
                table: "InsurancePolicies");

            migrationBuilder.CreateIndex(
                name: "IX_InsurancePolicies_PolicyNumber_CreatedById",
                table: "InsurancePolicies",
                columns: new[] { "PolicyNumber", "CreatedById" },
                unique: true);
        }
    }
}
