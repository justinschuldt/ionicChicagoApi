CREATE TABLE [dbo].[users] (
    [id]                NVARCHAR (255)     CONSTRAINT [DF_users_id] DEFAULT (CONVERT([nvarchar](255),newid(),(0))) NOT NULL,
    [createdAt]         DATETIMEOFFSET (7) CONSTRAINT [DF_users_createdAt] DEFAULT (CONVERT([datetimeoffset](7),sysutcdatetime(),(0))) NOT NULL,
    [updatedAt]         DATETIMEOFFSET (7) NULL,
    [version]           ROWVERSION         NOT NULL,
    [deleted]           BIT                DEFAULT ((0)) NULL,
    [email]             NVARCHAR (150)     NULL,
    [firstName]         NVARCHAR (60)     NULL,
    [lastName]          NVARCHAR (60)     NULL,
	[uuid]				  NVARCHAR (455)		NULL,
    PRIMARY KEY NONCLUSTERED ([id] ASC),
	CONSTRAINT [AK_users_email] UNIQUE ([email]),
	CONSTRAINT [AK_users_uuid] UNIQUE ([uuid])
);




GO
CREATE CLUSTERED INDEX [createdAt]
    ON [dbo].[users]([createdAt] ASC);


GO
CREATE TRIGGER [TR_users_InsertUpdateDelete] ON [dbo].[users]
		   AFTER INSERT, UPDATE, DELETE
		AS
		BEGIN
			SET NOCOUNT ON;
			IF TRIGGER_NESTLEVEL() > 3 RETURN;

			UPDATE [dbo].[users] SET [dbo].[users].[updatedAt] = CONVERT (DATETIMEOFFSET(7), SYSUTCDATETIME())
			FROM INSERTED
			WHERE INSERTED.id = [dbo].[users].[id]
		END