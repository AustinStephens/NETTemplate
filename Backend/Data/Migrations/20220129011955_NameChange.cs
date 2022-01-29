using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Data.Migrations
{
    public partial class NameChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "UserAddress",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_FullName",
                table: "Orders",
                newName: "ShippingAddress_LastName");

            migrationBuilder.AddColumn<string>(
                name: "Firstname",
                table: "UserAddress",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingAddress_Firstname",
                table: "Orders",
                type: "TEXT",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "0eaa972a-99de-471c-881b-9ed719cf7a0d");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "c1597797-a474-4e7c-abf5-f2b478c052c1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Firstname",
                table: "UserAddress");

            migrationBuilder.DropColumn(
                name: "ShippingAddress_Firstname",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "UserAddress",
                newName: "FullName");

            migrationBuilder.RenameColumn(
                name: "ShippingAddress_LastName",
                table: "Orders",
                newName: "ShippingAddress_FullName");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "7073af43-7586-4b31-9d20-b9cf251f4238");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "2dfb8e5b-bebf-4440-af29-c55bb52bb014");
        }
    }
}
