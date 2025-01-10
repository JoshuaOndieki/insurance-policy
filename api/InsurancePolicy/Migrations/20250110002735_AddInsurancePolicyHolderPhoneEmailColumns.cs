using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsurancePolicy.Migrations
{
    /// <inheritdoc />
    public partial class AddInsurancePolicyHolderPhoneEmailColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HolderEmail",
                table: "InsurancePolicies",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HolderPhone",
                table: "InsurancePolicies",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HolderEmail",
                table: "InsurancePolicies");

            migrationBuilder.DropColumn(
                name: "HolderPhone",
                table: "InsurancePolicies");
        }
    }
}
